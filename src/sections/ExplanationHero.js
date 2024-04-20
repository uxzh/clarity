import { Button, Card, CardBody, Image, Link } from "@nextui-org/react";
import HeroImage from "../lib/img/hero.png";
import HeroImageMobile from "../lib/img/hero-mobile.png";
import Step1 from "../lib/img/step1.png";
import Step2 from "../lib/img/step2.png";
import Step3 from "../lib/img/step3.png";
import Step4 from "../lib/img/step4.png";
import "../CSS/ExplanationHero.css";
import { useEffect, useState } from "react";

export default function ExplanationHero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative max-w-[1200px] mx-auto mt-12">
      <div
        id="product-explanation"
        style={{
          display: isMobile ? "flex" : "block",
          justifyContent: isMobile ? "center" : "unset",
        }}
      >
        <Image
          alt="Product"
          className="h-auto lg:w-auto"
          height="600"
          src={isMobile ? HeroImageMobile : HeroImage}
          style={{
            aspectRatio: isMobile ? "unset" : "860/630",
            objectFit: isMobile ? "contain" : "cover",
            width: isMobile ? "100%" : "95vw",
            maxWidth: isMobile ? "500px" : "1100px",
            height: isMobile ? "auto" : undefined,
          }}
        />
      </div>

      <div className="pt-8 lg:absolute lg:right-10 lg:-bottom-40">
        <Card
          aria-describedby="product-explanation"
          className="shadow-[0px_5px_0px_0px_#1a202c] lg:pt-0 flex items-center justify-center p-4 mx-auto lg:mx-0 mb-8 lg:mb-0"
          style={{
            marginTop: 50,
            maxWidth: 375,
            zIndex: 1000,
            border: "1px solid #1a202c",
          }}
        >
          <CardBody className="bg-opacity-75 text-black max-w-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">How it works?</h2>
            <ol className="space-y-4">
              <li className="flex items-center">
                <Image src={Step1} className="text-yellow-400 mr-2 h-8" />
                <span>Select one of the cash back tools</span>
              </li>
              <li className="flex items-center">
                <Image src={Step2} className="text-blue-400 mr-2 h-8" />
                <span>Login or use anonymously</span>
              </li>
              <li className="flex items-center">
                <Image src={Step3} className="text-green-400 mr-2 h-8" />
                <span>Save like never before!</span>
              </li>
              {/* <li className="flex items-center">
                <Image src={Step4} className="text-yellow-300 mr-2 h-8" />
                <span>Get the best card for each purchase!</span>
              </li> */}
            </ol>
            <Button
              as={Link}
              href="https://forms.gle/kcRvqnSBm1XSQVfa7"
              target="__blank"
              className="shadow-[0px_3px_0px_0px_#1a202c] mt-4"
              style={{ border: "2px solid #1a202c" }}
              variant="bordered"
            >
              Register Now
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
