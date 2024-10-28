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

  static async getOneByIdWithReviews(id) {
    try {
      const agg = 
      [
        {
          "$match": {
            "_id": {
              "$eq": new ObjectId(id)
            }
          }
        },
        {
          "$lookup": {
            "from": "reviews",
            "localField": "_id",
            "foreignField": "cardId",
            "as": "reviews"
          }
        },
        {
          "$unwind": {
            "path": "$reviews",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "$lookup": {
            "from": "users",
            "localField": "reviews.userId",
            "foreignField": "_id",
            "as": "userInfo"
          }
        },
        {
          "$unwind": {
            "path": "$userInfo",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "$addFields": {
            "reviews.user.username": "$userInfo.username",
            "reviews.user.avatar": "$userInfo.avatar"
          }
        },
        {
          "$group": {
            "_id": "$_id",
            "card": {
              "$first": "$$ROOT"
            },
            "reviews": {
              "$push": "$reviews"
            }
          }
        },
        {
          "$addFields": {
            "card.reviews": {
              $sortArray: {
                input: "$reviews",
                sortBy: { createdAt: -1 }
              }
            }
          }
        },
        {
          "$replaceRoot": {
            "newRoot": "$card"
          }
        },
        {
          "$unset": "userInfo"
        }
      ]

      return (await cards.aggregate(agg).toArray())[0];
    
    } catch (e) {
      console.error(`Unable to get card with reviews: ${e}`);
      return { error: e };
    }
  }

  static async getMany({
    page = 0,
    perPage = CARDS_PER_PAGE,
    sort = 'createdAt',
    searchTerm = '',
  }) {
    try {
      if (searchTerm) {
        return await cards
          .aggregate([
            {
              '$search': {
                'index': 'cards-search',
                'text': {
                  'query': searchTerm,
                  'path': ['cardName', 'bankName'],
                  'fuzzy': {
                    'maxEdits': 2
                  }
                }
              }
            }, 
            {
              '$addFields': {
                'score': {
                  '$meta': 'searchScore'
                }
              }
            },
            {
              '$sort': {
                'score': -1
              }
            }, 
          ])
          .skip(perPage * page)
          .limit(perPage)
          .toArray();
      }

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
                '$match': {
                  'bayesianRating': {
                    '$gte': 1
                  }
                }
              }, {
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
      return (await cards
        .aggregate(agg)
        .toArray())[0];
    } catch (e) {
      console.error(`Unable to get top cards: ${e}`)
    }
  }

  static async getDefaultSearchCards(
    {
      page = 0,
      perPage = 10,
    }
  ) {
    try {
      return await cards
        .find({ showByDefault: true })
        .skip(perPage * page)
        .limit(perPage)
        .toArray();
    } catch (e) {
      console.error(`Unable to get default search cards: ${e}`);
      return { error: e };
    }
  }
}

module.exports = CardsDAO;