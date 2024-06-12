import React from "react";
import CreditCard from "../components/ui/cards/credit_card/creditCard__wallet";
import {
  Tabs,
  Tab,
  Chip,
  Card,
  Image,
  CardFooter,
  Button,
} from "@nextui-org/react";

const creditCardData = [
  {
    imageLink:
      "https://ck-content.imgix.net/pcm/content/5ec5114adaf2e6ee3ae7-Alaska_Test.png?auto=compress%2Cformat&dpr=1",
    cashbackPercentage: 4.8,
    bankName: "Alaska Airlines",
    cardName: "Visa Signature®",
    ratingPosition: 1,
  },
  {
    imageLink:
      "https://www.bnc.ca/content/dam/bnc/particuliers/catalogue/cartes-credit/mycredit-card-300x190.png",
    cashbackPercentage: 3.2,
    bankName: "Chase JP Morgan",
    cardName: "Sapphire Preferred®",
    ratingPosition: 2,
  },
  {
    imageLink:
      "https://ck-content.imgix.net/pcm/content/9ee535871fd4cc339618-Discover_it_student_cashback_card_art_06_12.png?auto=compress%2Cformat&dpr=1",
    cashbackPercentage: 2.3,
    bankName: "Discover it",
    cardName: "Student Cash Back®",
    ratingPosition: 4,
  },
  {
    imageLink:
      "https://ck-content.imgix.net/pcm/content/9d57cd9cdc02ba1a9222-Simplcity_Card_1200x755.png?auto=compress%2Cformat&dpr=1",
    cashbackPercentage: 1,
    bankName: "Citi Bank",
    cardName: "Citi Simplicity®",
    ratingPosition: 5,
  },
  {
    imageLink:
      "https://ck-content.imgix.net/pcm/content/45b9c56b04c11415de8d-CCCapitalOne1012.png?auto=compress%2Cformat",
    cashbackPercentage: 1.7,
    bankName: "Capital One",
    cardName: "Venture Rewards®",
    ratingPosition: 3,
  },
];

const categoriesData = [
  { name: "Travel", imgSrc: "https://imgur.com/eViv8R6.png" },
  { name: "Dining", imgSrc: "https://imgur.com/yPSOySV.png" },
  { name: "Transportation & Gas", imgSrc: "https://imgur.com/MhmUUGW.png" },
  { name: "Entertainment", imgSrc: "https://imgur.com/10ahdC9.png" },
  { name: "Shopping", imgSrc: "https://imgur.com/gIlHr27.png" },
  { name: "Utilities & bills", imgSrc: "https://imgur.com/32OOFcX.png" },
];

export default function App() {
  const [selected, setSelected] = React.useState("cashback");

  // Sort the creditCardData array in descending order based on cashbackPercentage
  const sortedCreditCardData = [...creditCardData].sort(
    (a, b) => b.cashbackPercentage - a.cashbackPercentage
  );

  const CreditCardView = ({ creditCardData, index }) => {
    return (
      <div className="flex justify-center mb-4">
        <div className="flex items-center">
          <CreditCard
            index={index}
            imageLink={creditCardData.imageLink}
            cashbackPercentage={creditCardData.cashbackPercentage}
            bankName={creditCardData.bankName}
            cardName={creditCardData.cardName}
          />
        </div>
      </div>
    );
  };

  const CategoriesView = () => {
    const categoryCard = (category) => (
      <Card key={category.name} radius="lg" className="border-none" isPressable>
        <Image
          alt={category.name}
          className="object-cover scale-80"
          height={200}
          src={category.imgSrc}
          width={200}
        />
        <CardFooter className="absolute z-10">
          <Chip className="text-center" variant="flat" color="primary">
            {category.name}
          </Chip>
        </CardFooter>
      </Card>
    );

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[800px] mb-16 px-4">
        {categoriesData.map((category) => categoryCard(category))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">My Wallet</h2>
      {walletSelector()}
      <div className="flex flex-col items-center">
        {selected === "cashback" ? (
          sortedCreditCardData.map((cardData, index) => (
            <CreditCardView
              key={index}
              creditCardData={cardData}
              index={index}
            />
          ))
        ) : selected === "categories" ? (
          <CategoriesView />
        ) : null}
      </div>
    </div>
  );

  function walletSelector() {
    return (
      <Tabs
        className="justify-center mb-6"
        aria-label="Options"
        selectedKey={selected}
        size="lg"
        color="black"
        onSelectionChange={setSelected}
      >
        <Tab key="cashback" title="Flat Cashback"></Tab>
        <Tab key="categories" title="Categories"></Tab>
      </Tabs>
    );
  }
}
