require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

class DB {
  static async init() {
    if (DB.db) return;
    try {
      const client = await MongoClient.connect(
        process.env.MONGO_URI, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        }
      );
      DB.db = client.db(process.env.DB_NAME);
    } catch (e) {
      console.error(`Unable to establish connection with db: ${e}`);
    }
  }

  static async getCollection(name) {
    if (!DB.db) await DB.init();
    return DB.db.collection(name);
  }
}

module.exports = DB;