const { models } = require("./models");
const RepliesDAO = require("../dao/repliesDAO");
const ReviewsDAO = require("../dao/reviewsDAO");
const UsersDAO = require("../dao/usersDAO");
const CardsDAO = require("../dao/cardsDAO");
const LikesDAO = require("../dao/likesDAO");

const modelToDAO = {
  [models.users]: UsersDAO,
  [models.cards]: CardsDAO,
  [models.reviews]: ReviewsDAO,
  [models.replies]: RepliesDAO,
  [models.likes]: LikesDAO,
};

module.exports = {
  modelToDAO
}