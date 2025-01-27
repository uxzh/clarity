const {ObjectId} = require("mongodb");
const CardsDAO = require("../dao/cardsDAO");
const ReviewsDAO = require("../dao/reviewsDAO");
const LikesDAO = require("../dao/likesDAO");
const {getReviewsByCardIdWithLikes} = require("./utils");

class CardsController {
    static async getCard(req, res) {
        try {
            const {id} = req.params;
            const card = await CardsDAO.getOneById(id);
            if (!card) {
                return res.status(404).send({error: "Card not found"});
            }
            const reviews = await getReviewsByCardIdWithLikes({
                id,
                user: req.user,
                perPage: 20,
                page: 0,
            });
            card.reviews = reviews;
            res.status(200).send(card);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error fetching card"});
        }
    }

    static async getCards(req, res) {
        try {
            const {page, perPage, search} = req.query;
            const cards = await CardsDAO.getMany({
                page: page && parseInt(page),
                perPage: perPage && parseInt(perPage),
                searchTerm: search,
            });
            const {error} = cards;
            if (error) {
                return res.status(404).send(error)
            }
            res.status(200).send(cards);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error fetching cards"});
        }
    }

    static async getDefaultSearchCards(req, res) {
        try {
            const {page, perPage} = req.query;
            const cards = await CardsDAO.getDefaultSearchCards({
                page: page && parseInt(page),
                perPage: perPage && parseInt(perPage),
            });
            res.status(200).send(cards);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error fetching default search cards"});
        }
    }

    static async getReviewsByCard(req, res) {
        try {
            const {id} = req.params;
            const reviews = await getReviewsByCardIdWithLikes({
                id,
                user: req.user,
                sort: req.query.sort,
                sortDirection: parseInt(req.query.sortDirection) || -1,
                perPage: parseInt(req.query.perPage) || 20,
                page: parseInt(req.query.page) || 0,
            });
            const {error} = reviews;
            if (error) {
                return res.status(404).send(error)
            }
            res.status(200).send(reviews);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error fetching reviews"});
        }
    }

    static async getTopCards(req, res) {
        try {
            const cards = await CardsDAO.getTopCards()
            res.status(200).send(cards);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error fetching top cards"});
        }
    }

    static async createCard(req, res) {
        try {
            const {
                cardName,
                bankName,
                cardImageUrl,
                creditScoreRequired,
                fees,
                additionalBenefits,
                apr,
                cashbackPercentages,
                perks,
                redemptionOptions,
                rewards
            } = req.body;
            const date = new Date();
            const card = {
                cardName,
                bankName,
                cardImageUrl,
                creditScoreRequired,
                fees,
                additionalBenefits,
                apr,
                cashbackPercentages,
                perks,
                redemptionOptions,
                rewards,
                createdAt: date,
                updatedAt: date,
            };
            const result = await CardsDAO.createOne(card);
            if (!result || result.error) {
                return res.status(500).send({error: "Error creating card"});
            }
            card._id = result.insertedId
            res.status(201).send(card);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error creating card"});
        }
    }

    static async updateCard(req, res) {
        try {
            const {id} = req.params;
            const fields = ["cardName", "bankName", "cardImageUrl", "creditScoreRequired", "fees", "additionalBenefits", "apr", "cashbackPercentages", "perks", "redemptionOptions", "rewards", "additionalBenefits"];
            const data = {}
            fields.forEach(field => {
                if (Object.keys(req.body).includes(field)) {
                    data[field] = req.body[field];
                }
            });
            data.updatedAt = new Date();

            const result = await CardsDAO.updateOne({
                id,
                set: data,
            });
            if (!result || result.error) {
                return res.status(500).send({error: "Error updating card"});
            }

            res.status(200).send({_id: id, ...data});
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error updating card"});
        }
    }

    static async deleteCard(req, res) {
        try {
            const {id} = req.params;
            const result = await CardsDAO.deleteOne(id);
            if (!result || result.error) {
                return res.status(500).send({error: "Error deleting card"});
            }
            if (result.deletedCount === 0) {
                return res.status(404).send({error: "Card not found"});
            }
            res.status(204).send();
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error deleting card"});
        }
    }
}

module.exports = CardsController;
