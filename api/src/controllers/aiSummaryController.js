const { HfInference } = require('@huggingface/inference');
const { ObjectId } = require('mongodb');
const CardsDAO = require('../dao/cardsDAO');
const ReviewsDAO = require('../dao/reviewsDAO');
const NodeCache = require('node-cache'); // For caching
require('dotenv').config();

// Initialize cache with 5-minute TTL
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

class AISummaryController {
    static async generateCardSummary(req, res) {
        const { cardId } = req.params;
        const cacheKey = `summary_${cardId}`;

        try {
            // Check cache first
            const cachedSummary = cache.get(cacheKey);
            if (cachedSummary) {
                return res.status(200).send({ summary: cachedSummary, cached: true });
            }

            // Validate cardId
            if (!cardId || !ObjectId.isValid(cardId)) {
                return res.status(400).json({ error: 'Invalid card ID' });
            }

            // Get card details
            const card = await CardsDAO.getOneById(cardId);
            if (!card || card.error) {
                return res.status(404).json({ error: 'Card not found' });
            }

            // Get reviews for the card
            const reviewsResult = await ReviewsDAO.getManyByField({
                field: 'cardId',
                value: cardId,
                sort: 'createdAt',
                sortDirection: -1,
                perPage: 10, // Limit to 10 most recent reviews
            });

            if (reviewsResult.error) {
                return res.status(500).json({ error: 'Error fetching reviews' });
            }

            const reviews = reviewsResult[0]?.reviews || [];

            // If no reviews, use the card description from the database
            if (reviews.length === 0) {
                // Sanitize the description to prevent injection
                const description = (card.description || 'No description available').replace(/[<>"'&]/g, '');
                cache.set(cacheKey, description);
                return res.status(200).json({ summary: description });
            }

            // Prepare the prompt for the AI model
            const prompt = AISummaryController.preparePrompt(card, reviews);

            // Generate summary using Hugging Face API
            const summary = await AISummaryController.generateSummary(prompt);

            // Cache the summary
            cache.set(cacheKey, summary);

            // Return the summary
            res.status(200).json({ summary });
        } catch (error) {
            console.error(`Error in generateCardSummary: ${error.message}`);
            res.status(500).json({ error: 'Error generating card summary' });
        }
    }

    static preparePrompt(card, reviews) {
        // Sanitize card details to prevent injection
        const { cardName, bankName, description } = {
            cardName: (card.cardName || 'Unknown Card').replace(/[<>"'&]/g, ''),
            bankName: (card.bankName || 'Unknown Bank').replace(/[<>"'&]/g, ''),
            description: (card.description || 'No description available').replace(/[<>"'&]/g, ''),
        };

        // Format reviews, sanitizing content
        const formattedReviews = reviews
            .map((review, index) => {
                const sanitizedReview = {
                    rating: Math.max(1, Math.min(5, review.rating || 0)), // Ensure rating is 1-5
                    title: (review.title || 'No Title').replace(/[<>"'&]/g, ''),
                    content: (review.content || 'No content').replace(/[<>"'&]/g, ''),
                };
                return `Review ${index + 1}:
Rating: ${sanitizedReview.rating}/5
Title: ${sanitizedReview.title}
Review: ${sanitizedReview.content}`;
            })
            .join('\n\n');

        // Create the prompt
        return `Generate a concise summary for the ${cardName} credit card based on its description and user reviews. The summary should be informative, balanced, and easy to understand, avoiding jargon. Use bullet points or numbered lists for clarity.

Card: ${cardName}
Bank: ${bankName}
Description: ${description}

User Reviews:
${formattedReviews}

Please provide a summary that highlights:
1. Main benefits and features of the card
2. Common positive points mentioned in reviews
3. Common negative points mentioned in reviews
4. Overall sentiment and recommendation`;
    }

    static async generateSummary(prompt) {
        try {
            // Initialize Hugging Face Inference API client
            const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

            // Generate text using Zephyr-7b-beta model
            const response = await inference.textGeneration({
                model: 'HuggingFaceH4/zephyr-7b-beta',
                inputs: prompt,
                parameters: {
                    max_new_tokens: 512,
                    return_full_text: false, // Exclude prompt from response
                    temperature: 0.7,
                    top_p: 0.95,
                    do_sample: true,
                },
            });

            // Extract and clean the generated text
            let summary = (response.generated_text || '').trim();

            if (!summary) {
                return 'Unable to generate summary. Please try again later.';
            }

            // Process the AI response to extract and format the summary
            const processedSummary = AISummaryController.processAIResponse(summary);
            return processedSummary;
        } catch (error) {
            console.error('Error generating summary:', error.message);
            throw new Error('Failed to generate AI summary');
        }
    }

    static processAIResponse(aiResponse) {
        try {
            // Initialize sections
            const sections = {
                benefits: [],
                positives: [],
                negatives: [],
                sentiment: '',
            };

            // Define regex for section headers
            const benefitsRegex = /(?:main benefits|benefits and features|features|card benefits)/i;
            const positivesRegex = /(?:positive points|pros|advantages|strengths)/i;
            const negativesRegex = /(?:negative points|cons|disadvantages|weaknesses)/i;
            const sentimentRegex = /(?:overall sentiment|overall recommendation|recommendation|conclusion|summary)/i;

            // Split response into lines
            const lines = aiResponse.split('\n').map(line => line.trim()).filter(line => line);
            let currentSection = null;

            // Process each line
            for (const line of lines) {
                // Check for section headers
                if (benefitsRegex.test(line)) {
                    currentSection = 'benefits';
                    continue;
                } else if (positivesRegex.test(line)) {
                    currentSection = 'positives';
                    continue;
                } else if (negativesRegex.test(line)) {
                    currentSection = 'negatives';
                    continue;
                } else if (sentimentRegex.test(line)) {
                    currentSection = 'sentiment';
                    continue;
                }

                // Add content to the current section
                if (currentSection) {
                    const cleanedLine = line.replace(/^(\d+\.|\*|-)\s*/, '').trim();
                    if (cleanedLine) {
                        if (currentSection === 'sentiment') {
                            sections.sentiment += (sections.sentiment ? ' ' : '') + cleanedLine;
                        } else {
                            sections[currentSection].push(cleanedLine);
                        }
                    }
                }
            }

            // Fallback if sections are empty
            if (
                !sections.benefits.length &&
                !sections.positives.length &&
                !sections.negatives.length &&
                !sections.sentiment
            ) {
                return aiResponse.trim(); // Return raw response as fallback
            }

            // Format the processed summary for frontend
            let formattedSummary = '';
            if (sections.benefits.length) {
                formattedSummary += '## Main Benefits and Features\n';
                sections.benefits.forEach((benefit, index) => {
                    formattedSummary += `${index + 1}. ${benefit}\n`;
                });
                formattedSummary += '\n';
            }
            if (sections.positives.length) {
                formattedSummary += '## Positive Points\n';
                sections.positives.forEach((positive, index) => {
                    formattedSummary += `${index + 1}. ${positive}\n`;
                });
                formattedSummary += '\n';
            }
            if (sections.negatives.length) {
                formattedSummary += '## Negative Points\n';
                sections.negatives.forEach((negative, index) => {
                    formattedSummary += `${index + 1}. ${negative}\n`;
                });
                formattedSummary += '\n';
            }
            if (sections.sentiment) {
                formattedSummary += '## Overall Recommendation\n';
                formattedSummary += `${sections.sentiment}\n`;
            }

            return formattedSummary.trim();
        } catch (error) {
            console.error('Error processing AI response:', error.message);
            return aiResponse.trim(); // Return raw response if processing fails
        }
    }
}

module.exports = AISummaryController;
