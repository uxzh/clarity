require("dotenv").config();

const app = require('./app');
const UsersDAO = require('./src/dao/usersDAO');
const CardsDAO = require('./src/dao/cardsDAO');
const ReviewsDAO = require('./src/dao/reviewsDAO');
const LikesDAO = require('./src/dao/likesDAO');
const RepliesDAO = require('./src/dao/repliesDAO');
const { getDB } = require('./src/lib/connectToDB');

const run = async () => {
  const db = await getDB();

  await UsersDAO.injectDB(db);
  await CardsDAO.injectDB(db);
  await ReviewsDAO.injectDB(db); 
  await RepliesDAO.injectDB(db);
  await LikesDAO.injectDB(db);

  if (process.env.NODE_ENV === 'development') {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

run().catch(e => {
  console.error(e);
  process.exit(1);
})

module.exports = app;
