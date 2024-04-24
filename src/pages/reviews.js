import React from "react";
import TopNavbar from "../components/navbar/topNavbar";
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import Stars from "../components/REVIEW/rating/stars.tsx";

export default function Reviews() {
  function CardTOP({
    rating,
    cardImage,
    cardTitle,
    cardIssuer,
    cardRating,
    reviewsNmbr,
    starsNmbr,
  }) {
    return (
      <Card
        isPressable
        style={{
          width: "600px",
        }}
        className="shadow-none border mb-2"
      >
        <CardBody className="flex gap-3 ">
          <div className="flex justify-between">
            <div className="flex">
              <p className="m-auto w-10">#{rating}</p>
              <Image
                alt="nextui logo"
                height={40}
                radius="sm"
                src={cardImage}
                width={80}
              />
              <div className="flex flex-col ml-4">
                <p className="text-md">{cardTitle}</p>
                <p className="text-small text-default-500">{cardIssuer}</p>
              </div>
            </div>
            <div>
              <Stars
                cardRating={cardRating}
                reviewsNmbr={reviewsNmbr}
                starsNmbr={starsNmbr}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div id="review_div">
      <TopNavbar />
      {/* div horizontally centered using tailwind */}
      <div className="flex justify-center">
        <Card
          style={{ border: "1px solid #1a202c", maxWidth: 800 }}
          className="shadow-[0px_3px_0px_0px_#1a202c] lg:pt-0 flex items-center justify-center p-4 mx-auto lg:mx-0 mb-8 lg:mb-0"
        >
          <CardHeader>
            <h1 className="text-2xl font-bold">Top Credit Cards</h1>
          </CardHeader>
          <CardBody>
            <CardTOP
              rating={1}
              cardImage="https://ck-content.imgix.net/pcm/content/d0b0f0b9642e1cfcc50d-chasesapphirereserve_big.png?auto=compress&mask=corners&corner-radius=10"
              cardTitle="Chase Sapphire"
              cardIssuer="JPMorgan Chase"
              cardRating={4.5}
              reviewsNmbr={12}
              starsNmbr={5}
            />
            <CardTOP
              rating={2}
              cardImage="https://creditcards.wellsfargo.com/W-Card-MarketPlace/v2-8-24/images/Products/ActiveCash/WF_ActiveCash_RGB.png"
              cardTitle="Active Cash®"
              cardIssuer="Wells Fargo"
              cardRating={4.5}
              reviewsNmbr={12}
              starsNmbr={5}
            />
            <CardTOP
              rating={3}
              cardImage="https://ecm.capitalone.com/WCM/card/products/venture-card-art/mobile.png"
              cardTitle="Venture Rewards"
              cardIssuer="Capital One"
              cardRating={4.5}
              reviewsNmbr={12}
              starsNmbr={5}
            />
            <CardTOP
              rating={4}
              cardImage="https://ecm.capitalone.com/WCM/card/products/savorone-card-art/mobile.png"
              cardTitle="SavorOne Cash Rewards"
              cardIssuer="Capital One"
              cardRating={4.5}
              reviewsNmbr={12}
              starsNmbr={5}
            />
            <CardTOP
              rating={5}
              cardImage="https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_preferred_card.png"
              cardTitle="Balance Transfer"
              cardIssuer="Discover it®"
              cardRating={4.5}
              reviewsNmbr={12}
              starsNmbr={5}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
