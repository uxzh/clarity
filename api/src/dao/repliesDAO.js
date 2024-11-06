const { ObjectId } = require("mongodb");
const { models } = require("../lib/models");
const { getMongoClient, getDB } = require("../lib/connectToDB");

let replies;

class RepliesDAO {
  static async injectDB(db) {
    if (replies) return;
    try {
      replies = await db.collection(models.replies);
    } catch (e) {
      console.error(`Unable to establish collection handles in RepliesDAO: ${e}`);
    }
  }

  static async getTotal() {
    try {
      return await replies.countDocuments();
    } catch (e) {
      console.error(`Unable to get total number of replies: ${e}`);
      return { error: e };
    }
  }

  static async getManyByField({
    field,
    value,
    sort = "createdAt",
    page = 0,
    perPage = 20,
  }) {
    try {
      return await replies
        .find({ [field]: new ObjectId(value) })
        .sort({ [sort]: -1 })
        .skip(perPage * page)
        .limit(perPage)
        .toArray();
    } catch (e) {
      console.error(`Unable to get replies: ${e}`);
      return { error: e };
    }
  }

  static async createOne({
    reviewId,
    userId,
    content,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    try {
      return await replies.insertOne({
        reviewId: new ObjectId(reviewId),
        userId: new ObjectId(userId),
        content,
        createdAt,
        updatedAt,
      });
    } catch (e) {
      console.error(`Unable to create reply: ${e}`);
      return { error: e };
    }
  }

  static async updateOne({
    id,
    set,
  }) {
    try {
      return await replies.updateOne(
        { _id: new ObjectId(id) },
        { $set: set }
      );
    } catch (e) {
      console.error(`Unable to update reply: ${e}`);
      return { error: e };
    }
  }

  static async deleteOne(id) {
    try {
      const client = getMongoClient();
      const db = getDB();
      const session = client.startSession();
      const transactionOptions = {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" }
      };
      let result
      await session.withTransaction(async () => {
        const likes = db.collection(models.likes);
        await likes.deleteMany({ targetId: new ObjectId(id) }, { session });
        result = await replies.deleteOne({ _id: new ObjectId(id) }, { session });
      }, transactionOptions);
      session.endSession();
      return result;
    } catch (e) {
      console.error(`Unable to delete reply: ${e}`);
      session.endSession();
      return { error: e };
    }
  }
}

module.exports = RepliesDAO;