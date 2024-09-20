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

  static async createOne(reply) {
    try {
      return await replies.insertOne(reply);
    } catch (e) {
      console.error(`Unable to create reply: ${e}`);
      return { error: e };
    }
  }


}

module.exports = RepliesDAO;