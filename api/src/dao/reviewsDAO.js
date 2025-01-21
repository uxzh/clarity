const { ObjectId } = require("mongodb");
const { models } = require("../lib/models");
const { getMongoClient, getDB } = require("../lib/connectToDB");
const { is } = require("../middleware/validation/schemas/signupSchema");

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

  static async getTotal() {
    try {
      return await reviews.countDocuments();
    } catch (e) {
      console.error(`Unable to get total number of reviews: ${e}`);
      return { error: e };
    }
  }

  static getMany({
    sort = "createdAt",
    page = 0,
    perPage = 20,
  }) {
    try {
      return reviews.aggregate([
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
          $lookup: {
            from: models.cards,
            localField: "cardId",
            foreignField: "_id",
            as: "card"
          }
        },
        {
          $unwind: "$card"
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
            isHidden: 1,
            isAdminReview: 1,
            displayedUser: 1,
            "user.username": 1,
            "user.avatar": 1,
            "user.email": 1,
            "card.cardName": 1,
            "card.cardImageUrl": 1
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
    isHidden = false,
    isAdminReview = false,
    displayedUser = null
  }) {
    const review = {
      cardId: new ObjectId(cardId),
      userId: new ObjectId(userId),
      rating,
      title,
      content,
      createdAt,
      updatedAt,
      isHidden,
      isAdminReview,
    };
    if (isAdminReview && displayedUser) {
      review.displayedUser = displayedUser;
    }
    try {
      return await reviews.insertOne(review);
    } catch (e) {
      console.error(`Unable to create review: ${e}`);
      return { error: e };
    }
  }

  static async updateOne({
    id,
    set
  }) {
    try {
      return await reviews.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: set || {},
        }
      );
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
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
        const replies = db.collection(models.replies);
        await likes.deleteMany({ targetId: new ObjectId(id) }, { session });
        await replies.deleteMany({ reviewId: new ObjectId(id) }, { session });
        result = await reviews.deleteOne({ _id: new ObjectId(id) }, { session });
      }, transactionOptions);
      session.endSession();
      return result;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      session.endSession();
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
            isHidden: 1,
            "user.username": 1,
            "user.avatar": 1,
            isAdminReview: 1,
            displayedUser: 1
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
}

module.exports = ReviewsDAO;