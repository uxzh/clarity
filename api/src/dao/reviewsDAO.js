const { ObjectId } = require("mongodb");
const { models } = require("../lib/models");

let reviews;

class ReviewsDAO {
  static async injectDB(db) {
    if (reviews) return;
    try {
      reviews = await db.collection(models.reviews);
    } catch (e) {
      console.error(`Unable to establish collection handles in ReviewsDAO: ${e}`);
    }
  }

  static async getOneById(id) {
    try {
      return await reviews.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return { error: e };
    }
  }

  static async getOneByCardAndUser(cardId, userId) {
    try {
      return await reviews.findOne({
        cardId: new ObjectId(cardId),
        userId: new ObjectId(userId),
      });
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return { error: e };
    }
  }

  static async createOne({
    cardId,
    userId,
    rating,
    title,
    content,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    try {
      return await reviews.insertOne({
        cardId: new ObjectId(cardId),
        userId: new ObjectId(userId),
        rating,
        title,
        content,
        createdAt,
        updatedAt,
      });
    } catch (e) {
      console.error(`Unable to create review: ${e}`);
      return { error: e };
    }
  }

  static async getManyByField({
    field,
    value,
    sort = "createdAt",
    page = 0,
    perPage = 20,
  } = {}) {
    try {
      return await reviews.aggregate([
        {
          $match: { [field]: new ObjectId(value) }
        },
        {
          $lookup: {
            from: models.users,
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            _id: 1,
            cardId: 1,
            userId: 1,
            rating: 1,
            title: 1,
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            "user.username": 1,
            "user.avatar": 1
          }
        },
        {
          $sort: { [sort]: -1 }
        },
        {
          $skip: perPage * page
        },
        {
          $limit: perPage
        }
      ]).toArray();

    } catch (e) {
      console.error(`Unable to get reviews: ${e}`);
      return { error: e };
    }
  }

  // Add a method for fuzzy searching reviews using MongoDB's text search capabilities
  static async fuzzySearchReviews(query) {
    try {
      return await reviews.aggregate([
        {
          $search: {
            index: "reviews-search",
            text: {
              query: query,
              path: ["title", "content"],
              fuzzy: {
                maxEdits: 2
              }
            }
          }
        },
        {
          $lookup: {
            from: models.users,
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            _id: 1,
            cardId: 1,
            userId: 1,
            rating: 1,
            title: 1,
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            "user.username": 1,
            "user.avatar": 1
          }
        }
      ]).toArray();
    } catch (e) {
      console.error(`Unable to perform fuzzy search on reviews: ${e}`);
      return { error: e };
    }
  }

  // Add a method for sorting reviews by the number of likes
  static async getReviewsSortedByLikes({
    field,
    value,
    sort = "likes",
    page = 0,
    perPage = 20,
  } = {}) {
    try {
      return await reviews.aggregate([
        {
          $match: { [field]: new ObjectId(value) }
        },
        {
          $lookup: {
            from: models.likes,
            localField: "_id",
            foreignField: "targetId",
            as: "likes"
          }
        },
        {
          $addFields: {
            likesCount: { $size: "$likes" }
          }
        },
        {
          $lookup: {
            from: models.users,
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            _id: 1,
            cardId: 1,
            userId: 1,
            rating: 1,
            title: 1,
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            likesCount: 1,
            "user.username": 1,
            "user.avatar": 1
          }
        },
        {
          $sort: { [sort]: -1 }
        },
        {
          $skip: perPage * page
        },
        {
          $limit: perPage
        }
      ]).toArray();
    } catch (e) {
      console.error(`Unable to get reviews sorted by likes: ${e}`);
      return { error: e };
    }
  }
}

module.exports = ReviewsDAO;
