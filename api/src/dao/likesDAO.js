const { ObjectId } = require("mongodb");
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

  static async getTotal() {
    try {
      return await likes.countDocuments();
    } catch (e) {
      console.error(`Unable to get total number of likes: ${e}`);
      return { error: e };
    }
  }

  static async getLikeByUserAndTarget(userId, targetId) {
    try {
      return await likes.findOne({ 
        userId: new ObjectId(userId),
        targetId: new ObjectId(targetId),
      });
    } catch (e) {
      console.error(`Unable to get like: ${e}`);
      return { error: e };
    }
  }

  static async createOne({
    targetId,
    targetType,
    userId,
    isLike
  }) {
    try {
      return await likes.insertOne({
        targetId: new ObjectId(targetId),
        targetType,
        userId: new ObjectId(userId),
        isLike,
      });
    } catch (e) {
      console.error(`Unable to create like: ${e}`);
      return { error: e };
    }
  }

  static async updateOne({
    targetId,
    targetType,
    userId,
    isLike
  }) {
    try {
      return await likes.updateOne({
        targetId: new ObjectId(targetId),
        targetType,
        userId: new ObjectId(userId),
      }, {
        $set: {
          isLike
        }
      });
    } catch (e) {
      console.error(`Unable to update like: ${e}`);
      return { error: e };
    }
  }

  static async deleteLikeByUserAndTarget(userId, targetId) {
    try {
      return await likes.deleteOne({
        userId: new ObjectId(userId),
        targetId: new ObjectId(targetId),
      });
    } catch (e) {
      console.error(`Unable to delete like: ${e}`);
      return { error: e };
    }
  }

  static async existUserLikes(targetIds, userId, targetType='review'){
    try {
      return await likes.find({
        targetId: {$in: targetIds},
        userId: new ObjectId(userId),
        targetType
      }).toArray();
    } catch (e) {
      console.error(`Unable to get like: ${e}`);
      return { error: e };
    }
  }

  static async getManyCountByTargetIds(targetIds, targetType='review'){
    try {
      // count the number of likes and dislikes based on isLike field, group by targetId
      return await likes.aggregate([
        {
          $match: {
            targetId: {$in: targetIds},
            targetType
          }
        },
        {
          $group: {
            _id: "$targetId",
            count: { $sum: 1 },
            isLike: { $sum: { $cond: { if: "$isLike", then: 1, else: 0 } } }
          }
        }
      ]).toArray();
    } catch (e) {
      console.error(`Unable to get like: ${e}`);
      return { error: e };
    }
  }

}

module.exports = LikesDAO;