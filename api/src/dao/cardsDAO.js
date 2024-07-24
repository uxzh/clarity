let cards;

class CardsDAO {
  static async injectDB(conn) {
    if (cards) return;
    try {
      cards = await conn.db(process.env.DB_NAME).collection("cards");
    } catch (e) {
      console.error(`Unable to establish collection handles in cardsDAO: ${e}`);
    }
  }

  static async getCards() {
    try {
      return await cards.find().toArray();
    } catch (e) {
      console.error(`Unable to get cards: ${e}`);
      return { error: e };
    }
  }
}

module.exports = CardsDAO;