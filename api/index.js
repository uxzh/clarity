const { MongoClient, ServerApiVersion } = require('mongodb');

require("dotenv").config();
const app = require('./app');
const UsersDAO = require('./src/dao/usersDAO');
const CardsDAO = require('./src/dao/cardsDAO');

const PORT = process.env.PORT

MongoClient.connect(
  process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  }
).then(async client => {
  await UsersDAO.injectDB(client);
  await CardsDAO.injectDB(client);

  await app.listen(PORT);
  console.log(`Server running on port ${PORT}`);
}).catch(err => {
  console.error(err);
  process.exit(1);
});