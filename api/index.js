const { MongoClient, ServerApiVersion } = require('mongodb');

require("dotenv").config();

const app = require('./app');
const UsersDAO = require('./src/dao/usersDAO');
const CardsDAO = require('./src/dao/cardsDAO');
const ReviewsDAO = require('./src/dao/reviewsDAO');
const LikesDAO = require('./src/dao/likesDAO');
const RepliesDAO = require('./src/dao/repliesDAO');

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
  await ReviewsDAO.injectDB(client);
  await RepliesDAO.injectDB(client);
  await LikesDAO.injectDB(client);

  app.listen(PORT);
  console.log(`Server running on port ${PORT}`);
}).catch(err => {
  console.error(err);
  process.exit(1);
});