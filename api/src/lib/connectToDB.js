const { MongoClient, ServerApiVersion } = require("mongodb");

let client = null;
let db = null;

const getMongoClient = () => {
  if (client) {
    console.log('reusing client')
    return client;
  }
  try {
    console.log('creating new client')
    client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false, // in order to use $search
        deprecationErrors: true,
      }
    });
    return client;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

const getDB = () => {
  if (db) {
    return db;
  }
  try {
    const client = getMongoClient();
    // await client.connect();
    db = client.db(process.env.DB_NAME);
    return db;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

module.exports = {
  getMongoClient,
  getDB
};
