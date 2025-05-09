const {ObjectId} = require("mongodb");
const {models} = require("../lib/models");
const {getMongoClient, getDB} = require("../lib/connectToDB");

let users;
let cards;

class WalletDAO {
  static async injectDB(db) {
    if (cards) return;
    try {
      cards = await db.collection(models.cards);
      users = await db.collection(models.users);
    } catch (e) {
      console.error(`Unable to establish collection handles in WalletDAO: ${e}`);
    }
  }

  static async addCardToWallet({ userId, cardId }) {
    try {
      const updateResult = await users.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { wallet: new ObjectId(cardId) } }
      );

      if (updateResult.matchedCount === 0) {
        throw new Error("User not found");
      }

      return { success: true };
    } catch (e) {
      console.error(`Unable to add card to wallet: ${e}`);
      return { success: false, error: e.message };
    }
  }

  static async removeCardFromWallet({ userId, cardId }) {
    try {
      const updateResult = await users.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { wallet: new ObjectId(cardId) } }
      );

      if (updateResult.matchedCount === 0) {
        throw new Error("User not found");
      }

      return { success: true };
    } catch (e) {
      console.error(`Unable to remove card from wallet: ${e}`);
      return { success: false, error: e.message };
    }
  }

  static async getWalletCards(userId) {
    try {
      const user = await users.findOne(
        { _id: new ObjectId(userId) },
        { projection: { wallet: 1 } }
      );

      if (!user) {
        throw new Error("User not found");
      }

      const walletCardIds = user.wallet || [];
      const walletCards = await cards
        .find({ _id: { $in: walletCardIds } })
        .toArray();

      return { success: true, cards: walletCards };
    } catch (e) {
      console.error(`Unable to get wallet cards: ${e}`);
      return { success: false, error: e.message };
    }
  }
}

module.exports = WalletDAO;