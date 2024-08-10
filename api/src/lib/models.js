const RepliesDAO = require("../dao/repliesDAO");
const ReviewsDAO = require("../dao/reviewsDAO");
const UsersDAO = require("../dao/usersDAO");

const models = {
  users: 'users',
  reviews: 'reviews',
  replies: 'reviews',
}

const modelToDAO = {
  [models.users]: UsersDAO,
  [models.reviews]: ReviewsDAO,
  [models.replies]: RepliesDAO,
};

module.exports = {
  models,
  modelToDAO,
}