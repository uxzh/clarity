const { ObjectId } = require("mongodb");

let reviews;

class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) return;
    try {
      reviews = await conn.db(process.env.DB_NAME).collection("reviews");
    } catch (e) {
      console.error(`Unable to establish collection handles in ReviewsDAO: ${e}`);
    }
  }

  static async getReviewById(id) {
    try {
      return await reviews.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return { error: e };
    }
  }

  static async createReview(review) {
    try {
      return await reviews.insertOne(review);
    } catch (e) {
      console.error(`Unable to create review: ${e}`);
      return { error: e };
    }
  }
}

module.exports = ReviewsDAO;