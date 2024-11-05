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
}

module.exports = ReviewsDAO;