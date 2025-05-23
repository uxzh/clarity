const AISummaryController = require('../src/controllers/aiSummaryController');

// Sample AI response to test the processing function
const sampleAIResponse = `I need a concise summary of the following credit card based on its description and user reviews.

Card: Citi Double Cash®
Bank: Citi
Description: No description available

User Reviews:
Rating: 4/5
Title: Clutch Signing Bonus
Review: I have high credit Card debit and this card was one of the only cards on the market that allowed me to do a bank transfer with 0% APR for 18 months

Rating: 4/5
Title: No Bonus Categories, But Solid Rewards
Review: While the card doesn't offer bonus categories, the flat 2% cash back on everything makes up for it. I don't have to keep track of rotating categories or spending limits, which simplifies my finances. It's a reliable card for everyday use, though some may miss the opportunity to earn higher rewards in specific categories.

Please provide a summary that highlights:
1. The main benefits and features of the card
2. Common positive points mentioned in reviews
3. Common negative points mentioned in reviews
4. Overall sentiment and recommendation

Keep the summary concise, informative, and balanced.

Main Benefits and Features:
1. Flat 2% cash back on all purchases (1% when you buy, 1% when you pay)
2. No annual fee
3. 0% APR for 18 months on balance transfers
4. $200 sign-up bonus after spending $1,500 in 6 months

Positive Points:
1. Simple and straightforward rewards structure
2. No need to track rotating categories or spending limits
3. Encourages responsible spending (earn 1% when you pay)
4. Good for everyday purchases
5. Competitive cash back rate

Negative Points:
1. No bonus categories for higher rewards
2. Some may prefer cards with higher rewards in specific categories

Overall Sentiment and Recommendation:
The Citi Double Cash card is highly regarded for its simplicity and consistent rewards. It's particularly well-suited for those who prefer a straightforward approach to credit card rewards without having to track categories. The card is recommended as an excellent everyday card, especially for those who value simplicity and reliability over potentially higher rewards in specific categories.`;

// Add a debug function to the AISummaryController class to log the sections
AISummaryController.debugProcessAIResponse = function(aiResponse) {
    try {
        // Remove the prompt from the response if it's included
        let summary = aiResponse;
        if (summary.includes("I need a concise summary")) {
            const promptEndIndex = summary.indexOf("Please provide a summary that highlights:");
            if (promptEndIndex !== -1) {
                summary = summary.substring(promptEndIndex + "Please provide a summary that highlights:".length);
            }
        }

        // Extract the relevant sections from the AI response
        const sections = {
            benefits: [],
            positives: [],
            negatives: [],
            sentiment: ""
        };

        // Look for section headers in the response - use word boundaries to avoid matching within words
        const benefitsRegex = /(?:^|\b)(?:main benefits|benefits and features|features|card benefits)(?:\s*:|$)/i;
        const positivesRegex = /(?:^|\b)(?:positive points|pros|advantages|strengths)(?:\s*:|$)/i;
        const negativesRegex = /(?:^|\b)(?:negative points|cons|disadvantages|weaknesses)(?:\s*:|$)/i;
        const sentimentRegex = /(?:^|\b)(?:overall sentiment|overall recommendation|recommendation|conclusion|summary)(?:\s*:|$)/i;

        // Split the response into lines for processing
        const lines = summary.split('\n').map(line => line.trim()).filter(line => line);

        console.log('Lines:', lines);

        let currentSection = null;

        // Process each line to identify sections and content
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            console.log(`Line ${i}: "${line}"`);

            // Check if this line indicates a new section
            console.log(`  -> Testing regex patterns on line: "${line}"`);
            console.log(`  -> sentimentRegex.test: ${sentimentRegex.test(line)}`);
            console.log(`  -> benefitsRegex.test: ${benefitsRegex.test(line)}`);
            console.log(`  -> positivesRegex.test: ${positivesRegex.test(line)}`);
            console.log(`  -> negativesRegex.test: ${negativesRegex.test(line)}`);

            if (line.toLowerCase().includes("overall sentiment") || line.toLowerCase().includes("overall recommendation")) {
                console.log(`  -> Matched sentiment section (exact match): ${line}`);
                currentSection = 'sentiment';
                continue;
            } else if (sentimentRegex.test(line)) {
                console.log(`  -> Matched sentiment section (regex): ${line}`);
                currentSection = 'sentiment';
                continue;
            } else if (benefitsRegex.test(line)) {
                console.log(`  -> Matched benefits section: ${line}`);
                currentSection = 'benefits';
                continue;
            } else if (positivesRegex.test(line)) {
                console.log(`  -> Matched positives section: ${line}`);
                currentSection = 'positives';
                continue;
            } else if (negativesRegex.test(line)) {
                console.log(`  -> Matched negatives section: ${line}`);
                currentSection = 'negatives';
                continue;
            }

            // Debug the current section
            console.log(`  -> Current section: ${currentSection}`);

            // If we're in a section, add the content
            if (currentSection) {
                try {
                    // If the line starts with a number or bullet, it's likely a list item
                    if (/^(\d+\.|\*|\-)\s/.test(line)) {
                        if (currentSection === 'sentiment') {
                            sections.sentiment += (sections.sentiment ? ' ' : '') + line.replace(/^(\d+\.|\*|\-)\s/, '');
                        } else {
                            sections[currentSection].push(line.replace(/^(\d+\.|\*|\-)\s/, ''));
                        }
                    } else {
                        // Otherwise, it's probably paragraph text
                        if (currentSection === 'sentiment') {
                            sections.sentiment += (sections.sentiment ? ' ' : '') + line;
                        } else {
                            sections[currentSection].push(line);
                        }
                    }
                } catch (e) {
                    console.error(`Error adding content to section ${currentSection}:`, e);
                }
            }
        }

        console.log('Sections:', JSON.stringify(sections, null, 2));

        return sections;
    } catch (error) {
        console.error("Error in debug function:", error);
        return {};
    }
};

// Test the processAIResponse method
console.log('Testing processAIResponse method...');
// First run the debug function to see what's happening
console.log('Debug output:');
const debugSections = AISummaryController.debugProcessAIResponse(sampleAIResponse);
// Then run the actual function
const processedSummary = AISummaryController.processAIResponse(sampleAIResponse);
console.log('Processed Summary:');
console.log(processedSummary);

// Expected output should be a formatted summary with sections for benefits, positives, negatives, and overall sentiment
