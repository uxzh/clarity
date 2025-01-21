const fs = require('fs');
const path = require('path');
const { ObjectId } = require("mongodb");

const main = async () => {
  try {
    const cardsPath = path.resolve(__dirname, process.argv[2]);

    const data = fs.readFileSync(cardsPath, 'utf8');
    const cards = JSON.parse(data);
    cards.forEach(element => {
      if (typeof element._id === 'string') {
        element.oldId = element._id;
        element._id = {
          "$oid": new ObjectId()
        }
      }
    });

    let newPath = process.argv[3];
    if (!newPath) {
      newPath = cardsPath.split('.json')[0] + '-new.json';
    }
    fs.writeFileSync(newPath, JSON.stringify(cards, null, 2), 'utf8');
    console.log('File written to:', newPath);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();