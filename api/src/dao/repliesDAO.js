const { ObjectId } = require("mongodb");
const { models } = require("../lib/models");

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
}

module.exports = RepliesDAO;