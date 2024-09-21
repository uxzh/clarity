import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Link,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import TopNavbar from "../components/navbar/activeNavbar";
import Footer from "../components/footer/footer";
import Background from "../components/SEARCHCARD/background";
import {
  CardBody2,
  CardContainer,
  CardItem,
} from "../components/SEARCHCARD/floating/floatingCard.tsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { DataContext } from "../contexts/DataContext.js";
import { IconSearch } from "@tabler/icons-react";

function ReviewSearch() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { api } = useContext(AuthContext);
  const { topCards, setTopCards } = useContext(DataContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.getTopCards();
        setTopCards(data);
      } catch (error) {
        console.error("Error fetching card data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [api, setTopCards]);

  const handleSearch = (selectedCard) => {
    if (selectedCard) {
      navigate(`/review?cardId=${encodeURIComponent(selectedCard)}`);
    }
  };

  const renderCard = (card, title) => {
    if (!card) return null;

    return (
      <CardContainer className="w-full sm:w-[calc(50%-1rem)] md:w-[400px]">
        <CardBody2 className="bg-gray-50 dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            {title}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-lg mt-2 dark:text-neutral-300"
          >
            {card.cardName}
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4 relative">
            <div className="aspect-[1.586/1] w-full">
              <img
                src={card.cardImageUrl}
                alt={card.cardName}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-white dark:bg-black px-2 py-1 rounded-md text-lg font-bold">
              {card.averageRating?.toFixed(1)} ⭐
            </div>
          </CardItem>
          <div className="flex justify-between items-center mt-4">
            <CardItem
              translateZ={20}
              as={Link}
              href={`/review?cardId=${encodeURIComponent(card.cardName)}`}
              className="px-6 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold"
            >
              Go to Card
            </CardItem>
            <CardItem translateZ={20} className="text-sm text-neutral-500">
              {card.reviewCount} reviews
            </CardItem>
          </div>
        </CardBody2>
      </CardContainer>
    );
  };

  const heroText = (
    <div className="relative py-8 px-4">
      <h2 className="relative z-10 text-3xl font-semibold mb-2 text-gray-800 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
        Credit cards lack{" "}
        <span className="font-black text-primary drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
          Clarity
        </span>
      </h2>
      <h1 className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-slate-900 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
        Honest feedback matters.
      </h1>
    </div>
  );

  const autocompleteItems = topCards
    ? [
        topCards.bestRatingCard,
        topCards.worstRatingCard,
        topCards.mostReviewedCard,
      ].filter(Boolean)
    : [];

  return (
    <div>
      <TopNavbar />
      <div className="flex-grow flex flex-col items-center justify-start relative">
        <Background className="absolute top-0 left-0 right-0 h-[50vh] z-5" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-0 sm:px-4 pt-20">
          <div className="text-center mx-auto mb-[4vh]">
            {heroText}

            <div className="mx-auto w-full px-4 sm:px-0 sm:max-w-xl">
              <Autocomplete
                classNames={{
                  base: "w-full max-w-full",
                  listboxWrapper: "max-h-[320px]",
                  selectorButton: "text-default-500",
                }}
                defaultItems={autocompleteItems}
                inputProps={{
                  classNames: {
                    input: "ml-1 text-base sm:text-lg",
                    inputWrapper: "h-[56px] sm:h-[64px]",
                  },
                }}
                listboxProps={{
                  hideSelectedIcon: true,
                  itemClasses: {
                    base: [
                      "rounded-medium",
                      "text-default-500",
                      "transition-opacity",
                      "data-[hover=true]:text-foreground",
                      "dark:data-[hover=true]:bg-default-50",
                      "data-[pressed=true]:opacity-70",
                      "data-[hover=true]:bg-default-200",
                      "data-[selectable=true]:focus:bg-default-100",
                      "data-[focus-visible=true]:ring-default-500",
                    ],
                  },
                }}
                aria-label="Search for a credit card"
                placeholder="Enter card name"
                popoverProps={{
                  offset: 10,
                  classNames: {
                    base: "rounded-large",
                    content:
                      "p-1 border-small border-default-100 bg-background",
                  },
                }}
                startContent={
                  <IconSearch className="text-default-400 w-6 h-6" stroke={2} />
                }
                radius="full"
                variant="bordered"
                onSelectionChange={handleSearch}
                size="lg"
              >
                {(item) => (
                  <AutocompleteItem
                    key={item.cardName}
                    textValue={item.cardName}
                  >
                    <div className="flex items-center">
                      <img
                        src={item.cardImageUrl}
                        alt={item.cardName}
                        className="w-16 h-10 object-contain mr-3"
                      />
                      <div className="flex flex-col">
                        <span className="text-small font-bold">
                          {item.cardName}
                        </span>
                        <span className="text-tiny text-default-400">
                          Issuer: Unknown
                        </span>
                      </div>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-2 px-4 w-full max-w-6xl mx-auto">
            {renderCard(topCards?.bestRatingCard, "Best Rated Card")}
            {renderCard(topCards?.worstRatingCard, "Most Controversial Card")}
            {renderCard(topCards?.mostReviewedCard, "Most Discussed Card")}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ReviewSearch;