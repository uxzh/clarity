const DB = require("./db");

// Bayesian score calculation
const INITIAL_BELIEF = 2.5;
const INITIAL_BELIEF_WEIGHT = 3;
const ROUND_TO = 4;

class EvalScore {
  static async getData() {
    try {
      this.cards = await DB.getCollection("cards");
      this.reviews = await DB.getCollection("reviews");
    } catch (e) {
      console.error(`Unable to get collections: ${e}`);
      return { error: e };
    }
  }

  static bayesianScoreAgg = [
    {
      '$lookup': {
        'from': 'reviews', 
        'localField': '_id', 
        'foreignField': 'cardId', 
        'as': 'reviews'
      }
    }, 
    {
      '$addFields': {
        'averageRating': {
          '$avg': '$reviews.rating'
        }, 
        'reviewCount': {
          '$size': '$reviews'
        }
      }
    }, 
    {
      '$project': {
        'averageRating': {
          '$round': [
            '$averageRating', ROUND_TO
          ]
        }, 
        'reviewCount': 1
      }
    }, 
    {
      '$addFields': {
        'bayesianRating': {
          '$round': [
            {
              '$divide': [
                {
                  '$add': [
                    {
                      '$multiply': [INITIAL_BELIEF, INITIAL_BELIEF_WEIGHT]
                    }, {
                      '$multiply': ['$averageRating', '$reviewCount']
                    }
                  ]
                }, {
                  '$add': [INITIAL_BELIEF_WEIGHT, '$reviewCount']
                }
              ]
            }, 4
          ]
        }
      }
    }, 
    {
      '$project': {
        '_id': 1,
        'averageRating': 1, 
        'bayesianRating': 1, 
        'reviewCount': 1
      }
    }, 
    {
      '$merge': {
        'into': 'cards',
        'whenNotMatched': 'fail'
      }
    }
  ];

  static async updateRating() {
    try {
      await this.getData();
      const result = await this.cards.aggregate(this.bayesianScoreAgg).toArray();
      console.log(result)
    } catch (e) {
      console.error(`Error running the evaluation: ${e}`);
    }
  }
}



const main = async () => {
  try {
    await DB.init();
    await EvalScore.updateRating();
    console.log("Rating update complete");
    process.exit(0);
  } catch (e) {
    console.error(`Error running the rating update: ${e}`);
    process.exit(1);
  }
}

main();