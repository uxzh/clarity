import React from "react";
import { Button } from "@nextui-org/react";
import { ButtonFlickeringLight } from "../components/buttons/HeroButton";
import CheckmarksHero from "./../components/ui/checkmarksHero";

export default function Hero() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: "80vw",
          width: "600px",
        }}
      >
        <p className="text-center uppercase text-lg font-light">
          Not enough cashback?
        </p>
        <div className="">
          <h1
            className="text-4xl uppercase font-bold text-center"
            style={{
              fontWeight: 900,
              fontSize: "4.25em",
              lineHeight: "1em",
            }}
          >
            Make daily purchases
            <span className="text-6xl uppercase">
              <br /> & earn cash
            </span>{" "}
          </h1>
        </div>
        <CheckmarksHero />
        <div className="flex justify-center mt-8 gap-4">
          <ButtonFlickeringLight />
          <Button color="primary" size="lg" variant="flat">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
}
