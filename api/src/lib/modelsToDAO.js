const { models } = require("./models");
const RepliesDAO = require("../dao/repliesDAO");
const ReviewsDAO = require("../dao/reviewsDAO");
const UsersDAO = require("../dao/usersDAO");

const modelToDAO = {
  [models.users]: UsersDAO,
  [models.reviews]: ReviewsDAO,
  [models.replies]: RepliesDAO,
};

module.exports = {
  modelToDAO
}