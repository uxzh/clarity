import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Link } from "@nextui-org/react";
import TopNavbar from "../components/navbar/activeNavbar";
import Footer from "../components/footer/footer";
import Background from "../components/SEARCHCARD/background";
import {
  CardBody2,
  CardContainer,
  CardItem,
} from "../components/SEARCHCARD/floating/floatingCard.tsx";

const OptimizedImage = React.memo(({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
  );

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
    };
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
        imageSrc === src ? "opacity-100" : "opacity-50"
      }`}
      loading="lazy"
    />
  );
});

const CardComponent = React.memo(({ card, title }) => {
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
          {card.name}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4 relative">
          <div className="aspect-[1.586/1] w-full">
            <OptimizedImage
              src={card.image}
              alt={card.name}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="absolute bottom-2 right-2 bg-white dark:bg-black px-2 py-1 rounded-md text-lg font-bold">
            {card.rating.toFixed(1)} ⭐
          </div>
        </CardItem>
        <div className="flex justify-between items-center mt-4">
          <CardItem
            translateZ={20}
            as={Link}
            href={`/review?cardId=${encodeURIComponent(card.name)}`}
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
});

function ReviewSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bestCard, setBestCard] = useState(null);
  const [worstCard, setWorstCard] = useState(null);
  const [popularCard, setPopularCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBestCard({
          name: "Chase Sapphire Preferred",
          rating: 4.8,
          image:
            "https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_preferred_card.png",
          reviewCount: 62,
        });
        setWorstCard({
          name: "Generic Bank Basic Card",
          rating: 2.1,
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqnEkjjmUFXzjDYsxoVRLCqRD8LG2PvMj3C9l3Ng6O9gFAvemSfCvR0JrLQsthAdv8EqA&usqp=CAU",
          reviewCount: 72,
        });
        setPopularCard({
          name: "American Express Gold",
          rating: 4.5,
          image:
            "https://he.americanexpress.co.il/globalassets/CardsImages/191_403_-1/Benefit_AMEX_Business_gold_2024.png",
          reviewCount: 128,
        });
      } catch (error) {
        console.error("Error fetching card data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/review?cardId=${encodeURIComponent(searchTerm)}`);
    }
  };

  const memoizedCards = useMemo(() => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-2 px-4 w-full max-w-6xl mx-auto">
        {bestCard && <CardComponent card={bestCard} title="Best Rated Card" />}
        {worstCard && (
          <CardComponent card={worstCard} title="Most Controversial Card" />
        )}
        {popularCard && (
          <CardComponent card={popularCard} title="Most Discussed Card" />
        )}
      </div>
    );
  }, [bestCard, worstCard, popularCard]);

  return (
    <div>
      <TopNavbar />
      <div className="flex-grow flex flex-col items-center justify-start relative">
        <Background className="absolute top-0 left-0 right-0  h-[50vh] z-5" />
        <div className="relative z-10 w-[80%] max-w-6xl mx-auto px-4 pt-20">
          <div className="text-center mx-auto mb-[4vh]">
            <div className="relative py-8 px-4">
              <h2 className="relative z-10 text-3xl font-semibold mb-2 text-gray-800 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                Credit cards lack{" "}
                <span className="font-black text-primary drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                  Clarity
                </span>
                .
              </h2>
              <h1 className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-slate-900 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                Let's change it by leaving feedback!
              </h1>
            </div>

            <div className="mx-auto max-w-xl w-full">
              <form
                onSubmit={handleSearch}
                className="flex flex-row sm:flex-row items-center justify-center"
              >
                <Input
                  color="black"
                  variant="bordered"
                  type="text"
                  placeholder="Enter card name"
                  size="lg"
                  isClearable
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mr-2 w-4xl bg-white rounded-2xl"
                />
                <Button
                  type="submit"
                  style={{ border: "1px solid #1a202c" }}
                  variant="bordered"
                  className="shadow-[0px_3px_0px_0px_#1a202c] bg-white"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          memoizedCards
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ReviewSearch;
