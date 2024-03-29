import { Image } from "@nextui-org/react";
import "../../CSS/Partners.css";
import { useEffect, useState } from "react";
import Amex from "../../lib/icons/amex.png";

export default function Partners() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const styles = {
    marginTop: isMobile ? "20px" : "140px",
  };

  const banks = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Bank_of_America_logo.svg/2560px-Bank_of_America_logo.svg.png",
      alt: "Bank of America",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Chase_logo_2007.svg/1200px-Chase_logo_2007.svg.png",
      alt: "Chase",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Citibank.svg/2560px-Citibank.svg.png",
      alt: "Citibank",
    },
    {
      src: Amex,
      alt: "American Express",
    },
  ];

  return (
    <div style={styles}>
      <div className="h-full max-w-6xl px-8 pb-12 mx-auto md:px-12 lg:px-32">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <h2 className="text-lg leading-8 text-center text-gray-900">
            We work with your favorite banks.
          </h2>
          <div className="grid gridpartners">
            {banks.map((bank, index) => (
              <div key={index}>
                <Image
                  style={{
                    width: "100%",
                    maxHeight: 60,
                    borderRadius: 0,
                    objectFit: "contain",
                  }}
                  src={bank.src}
                  alt={bank.alt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
