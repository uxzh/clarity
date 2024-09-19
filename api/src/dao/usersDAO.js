const { ObjectId } = require("mongodb");
const { models } = require("../lib/models");

let users;

class UsersDAO {
  static async injectDB(db) {
    if (users) return;
    try {
      users = await db.collection(models.users);
    } catch (e) {
      console.error(`Unable to establish collection handles in usersDAO: ${e}`);
    }
  }

  static async getOneById(id) {
    try {
      return await users.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get user: ${e}`);
      return { error: e };
    }
  }

  static async getOneByField(field, value) {
    try {
      return await users.findOne({ [field]: value });
    } catch (e) {
      console.error(`Unable to get user: ${e}`);
      return { error: e };
    }
  }

  static async createOne(user) {
    try {
      return await users.insertOne(user);
    } catch (e) {
      console.error(`Unable to create user: ${e}`);
      return { error: e };
    }
  }

  static async updateOne({id, set, push}) {
    try {
      return await users.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: set || {},
          $push: push || {},
        }
      );
    } catch (e) {
      console.error(`Unable to update user: ${e}`);
      return { error: e };
    }
  }

  static async deleteOne(id) {
    try {
      return await users.deleteOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to delete user: ${e}`);
      return { error: e };
    }
  }
}

module.exports = UsersDAO;