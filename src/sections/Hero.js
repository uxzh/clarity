import React from "react";
import { Button, Link } from "@nextui-org/react";
import { ButtonFlickeringLight } from "../components/buttons/HeroButton";
import CheckmarksHero from "./../components/ui/checkmarksHero";
import "../CSS/Hero.css";

export default function Hero() {
  const handleLearnMoreClick = () => {
    const explanationSection = document.getElementById("explanation");
    if (explanationSection) {
      explanationSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: "80vw",
          width: "600px",
        }}
      >
        <div id="bgbgbg"></div>
        <p className="text-center uppercase text-lg font-light">
          Not enough cashback?
        </p>
        <div className="">
          <h1
            className=" uppercase font-bold text-center"
            id="herotext"
            style={{
              fontWeight: 900,
              lineHeight: "1em",
            }}
          >
            Make daily purchases
            <br /> & earn cash
          </h1>
        </div>
        <CheckmarksHero />
        <div className="flex justify-center mt-8 gap-4">
          <Button
            as={Link}
            size="lg"
            href="https://forms.gle/kcRvqnSBm1XSQVfa7"
            target="__blank"
            variant="bordered"
            className="shadow-[0px_3px_0px_0px_#1a202c] "
            style={{ border: "2px solid #1a202c" }}
          >
            Beta Registration
          </Button>
          <Button onClick={handleLearnMoreClick} size="lg" variant="flat">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
}
