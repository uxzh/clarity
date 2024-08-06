let replies;

class RepliesDAO {
  static async injectDB(conn) {
    if (replies) return;
    try {
      replies = await conn.db(process.env.DB_NAME).collection("replies");
    } catch (e) {
      console.error(`Unable to establish collection handles in RepliesDAO: ${e}`);
    }
  }

  static async createReply(reply) {
    try {
      return await replies.insertOne(reply);
    } catch (e) {
      console.error(`Unable to create reply: ${e}`);
      return { error: e };
    }
  }


}

module.exports = RepliesDAO;