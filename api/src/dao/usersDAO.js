let users;

class UsersDAO {
  static async injectDB(conn) {
    if (users) return;
    try {
      users = await conn.db(process.env.DB_NAME).collection("users");
    } catch (e) {
      console.error(`Unable to establish collection handles in usersDAO: ${e}`);
    }
  }

  static async getUserByField(field, value) {
    try {
      return await users.findOne({ [field]: value });
    } catch (e) {
      console.error(`Unable to get user: ${e}`);
      return { error: e };
    }
  }

  static async createUser(user) {
    try {
      return await users.insertOne(user);
    } catch (e) {
      console.error(`Unable to create user: ${e}`);
      return { error: e };
    }
  }
}

module.exports = UsersDAO;