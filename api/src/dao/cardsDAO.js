const { ObjectId } = require("mongodb");

let cards;

const CARDS_PER_PAGE = 20;

class CardsDAO {
  static async injectDB(conn) {
    if (cards) return;
    try {
      cards = await conn.db(process.env.DB_NAME).collection("cards");
    } catch (e) {
      console.error(`Unable to establish collection handles in cardsDAO: ${e}`);
    }
  }

  static async getOneById(id) {
    try {
      return await cards.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get card: ${e}`);
      return { error: e };
    }
  }

  static async getMany({
     page = 0,
     perPage = CARDS_PER_PAGE,
     sort = 'createdAt',
  } = {}) {
    try {
      return await cards
        .find()
        .sort({ [sort]: -1 })
        .skip(perPage * page)
        .limit(perPage)
        .toArray();
    } catch (e) {
      console.error(`Unable to get cards: ${e}`);
      return { error: e };
    }
  }
}

module.exports = CardsDAO;