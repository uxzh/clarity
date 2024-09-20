const DB = require("./db");

const COLLECTIONS = [
  "cards",
  "users",
  "reviews",
  "replies",
];

class DataGenerator {
  static GENERATORS = {
    "reviews": DataGenerator._generateReviews,
    "replies": DataGenerator._generateReplies,
  }

  static async _getCollections() {
    const names = process.argv.slice(2);
    DataGenerator.collectionToGenerate = []; // preserve order
    for (const name of COLLECTIONS) {
      if (names.includes(name)) DataGenerator.collectionToGenerate.push(name)
    }

    DataGenerator.collections = {};
    for (const name of COLLECTIONS) {
      try {
        const collection = await DB.getCollection(name);
        DataGenerator.collections[name] = collection;
      } catch (e) {
        console.error(`Unable to get collection: ${e}`);
      }
    }
  }

  static async _generateData() {
    try {
      await DataGenerator._getCollections();
      for (const name of DataGenerator.collectionToGenerate) {
        if (DataGenerator.GENERATORS[name]) {
          await DataGenerator.GENERATORS[name]();
        }
      }
    } catch (e) {
      console.error(`Unable to generate data: ${e}`);
      process.exit(1);
    }
    process.exit(0);
  }

  static async run() {
    try {
      const args = process.argv.slice(2);
      if (args.length === 0 || ["--help", "-h"].includes(args[0])) {
        console.log("Usage: node generateData.js [collection1 collection2 ...]");
        console.log("Available collections: reviews, replies");
        return;
      }

      await DataGenerator._generateData();
    } catch (e) {
      console.error(`Unable to run: ${e}`);
      process.exit(1);
    }
  }

  static async _generateReviews() {
    const cards = await DataGenerator.collections.cards.find().toArray();
    const users = await DataGenerator.collections.users.find().toArray();

    const reviews = [];
    cards.forEach(element => {
      users.forEach(user => {
        // randomly continue
        if (Math.random() > 0.5) return
        reviews.push({
          userId: user._id,
          cardId: element._id,
          rating: Math.floor(Math.random() * 5) + 1,
          title: 'This is a title',
          content: 'This is a review',
          // random date between card creation date and now
          createdAt: new Date(element.createdAt.getTime() + Math.floor(Math.random() * (Date.now() - element.createdAt.getTime()))),
        });
      });
    });
    await DataGenerator.collections.reviews.insertMany(reviews);
    console.log('Reviews inserted');
  }

  static async _generateReplies() {
    const reviews = await DataGenerator.collections.reviews.find().toArray();
    const users = await DataGenerator.collections.users.find().toArray();

    const replies = [];
    reviews.forEach(review => {
      users.forEach(user => {
        // randomly continue
        if (Math.random() > 0.5) return
        replies.push({
          userId: user._id,
          reviewId: review._id,
          content: 'This is a reply',
          // random date between review creation date and now
          createdAt: new Date(review.createdAt.getTime() + Math.floor(Math.random() * (Date.now() - review.createdAt.getTime()))),
        });
      });
    });
    await DataGenerator.collections.replies.insertMany(replies);
    console.log('Replies inserted');
  }
}

DataGenerator.run();