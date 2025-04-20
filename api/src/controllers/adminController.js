const CardsDAO = require("../dao/cardsDAO");
const {models} = require("../lib/models");
const {modelToDAO} = require("../lib/modelsToDAO");

class AdminController {
    static async getTotals(req, res) {
        try {
            const items = [
                models.users,
                models.cards,
                models.reviews,
                models.likes
            ];
            const totals = {};
            await Promise.all(items.map(async model => {
                const dao = modelToDAO[model];
                const total = await dao.getTotal();
                if (total.error) {
                    throw new Error(total.error);
                }
                totals[model] = total;
            }));
            res.status(200).send(totals);
        } catch (e) {
            console.error(e)
            res.status(500).send({error: "Error fetching totals"});
        }
    }
}

module.exports = AdminController;
