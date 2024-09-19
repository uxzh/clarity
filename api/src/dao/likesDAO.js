const { models } = require("../lib/models");

let likes;

class LikesDAO {
  static async injectDB(db) {
    if (likes) return;
    try {
      likes = await db.collection(models.likes);
    } catch (e) {
      console.error(`Unable to establish collection handles in LikesDAO: ${e}`);
    }
  }

  static async getLikeByUserAndTarget(userId, targetId) {
    try {
      return await likes.findOne({ userId, targetId });
    } catch (e) {
      console.error(`Unable to get like: ${e}`);
      return { error: e };
    }
  }

  static async createOne(like) {
    try {
      return await likes.insertOne(like);
    } catch (e) {
      console.error(`Unable to create like: ${e}`);
      return { error: e };
    }
  }

  static async deleteLikeByUserAndTarget(userId, targetId) {
    try {
      return await likes.deleteOne({ userId, targetId });
    } catch (e) {
      console.error(`Unable to delete like: ${e}`);
      return { error: e };
    }
  }


}

module.exports = LikesDAO;