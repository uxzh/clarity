const { ObjectId } = require("mongodb");
const { models } = require("../lib/models");

let cards;

const CARDS_PER_PAGE = 20;

class CardsDAO {
  static async injectDB(db) {
    if (cards) return;
    try {
      cards = await db.collection(models.cards);
    } catch (e) {
      console.error(`Unable to establish collection handles in cardsDAO: ${e}`);
    }
  }

  static async getOneById(id) {
    try {
      return await cards.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get card: ${e}`);
      return { error: e };
    }
  }

  static async getMany({
     page = 0,
     perPage = CARDS_PER_PAGE,
     sort = 'createdAt',
  } = {}) {
    try {
      return await cards
        .find()
        .sort({ [sort]: -1 })
        .skip(perPage * page)
        .limit(perPage)
        .toArray();
    } catch (e) {
      console.error(`Unable to get cards: ${e}`);
      return { error: e };
    }
  }

  static async getTopCards() {
    try {
      const agg = [
        {
          '$facet': {
            'best_rating': [
              {
                '$sort': {
                  'bayesianRating': -1
                }
              }, {
                '$limit': 1
              }
            ], 
            'worst_rating': [
              {
                '$sort': {
                  'bayesianRating': 1
                }
              }, {
                '$limit': 1
              }
            ], 
            'most_reviews': [
              {
                '$sort': {
                  'reviewCount': -1
                }
              }, {
                '$limit': 1
              }
            ]
          }
        }, {
          '$project': {
            'best_rating': {
              '$arrayElemAt': [
                '$best_rating', 0
              ]
            }, 
            'worst_rating': {
              '$arrayElemAt': [
                '$worst_rating', 0
              ]
            }, 
            'most_reviews': {
              '$arrayElemAt': [
                '$most_reviews', 0
              ]
            }
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              'bestRatingCard': '$best_rating', 
              'worstRatingCard': '$worst_rating', 
              'mostReviewedCard': '$most_reviews'
            }
          }
        }
      ]
      return await cards
        .aggregate(agg)
        .toArray()
    } catch (e) {
      console.error(`Unable to get top cards: ${e}`)
    }
  }
}

module.exports = CardsDAO;