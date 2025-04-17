const CardsDAO = require("../dao/cardsDAO");
const WalletDAO = require("../dao/walletDAO");
const {models} = require("../lib/models");
const {modelToDAO} = require("../lib/modelsToDAO");

class WalletController {
    static async addCardToWallet(req, res) {
        try {
            const {id} = req.params;
            const card = await CardsDAO.getOneById(id);
            if (!card) {
                return res.status(404).send({error: "Card not found"});
            }

            const {success, error} = await WalletDAO.addCardToWallet({
                userId: req.user._id,
                cardId: id
            })
            if (!success) {
                console.log(error)
                return res.status(400).send({error: "Couldn't add card to wallet"})
            }

            return res.status(200).send({
                userId: req.user._id,
                cardId: id
,            });
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "adding card to wallet"});
        }
    }

    static async removeCardToWallet(req, res) {
        try {
            const {id} = req.params;
            const card = await CardsDAO.getOneById(id);
            if (!card) {
                return res.status(404).send({error: "Card not found"});
            }

            const {success, error} = await WalletDAO.removeCardFromWallet({
                userId: req.user._id,
                cardId: id
            })
            if (!success) {
                console.log(error)
                return res.status(400).send({error: "Couldn't remove card from wallet"})
            }

            return res.status(204).send()
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error removing card from wallet"});
        
        }
    }

    static async getWalletCards(req, res) {
        try {
            const {success, cards, error} = await WalletDAO.getWalletCards(req.user._id);

            if (!success) {
                console.log(error)
                return res.status(400).send({error: "Couldn't get walet cards"})
            }
            return res.status(200).send(cards);
        } catch (e) {
            console.error(e);
            res.status(500).send({error: "Error getting wallet cards"});
        }
    }
}

module.exports = WalletController;
