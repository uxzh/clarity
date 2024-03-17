import { Image } from "@nextui-org/react";
import "../../CSS/Partners.css";

export default function Partners() {
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
      src: "https://seeklogo.com/images/G/goldman-sachs-logo-B826CAF741-seeklogo.com.png",
      alt: "Goldman Sachs",
    },
  ];
  return (
    <div className="mt-4">
      <div className="h-full max-w-6xl px-8 pb-12 mx-auto md:px-12 lg:px-32">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <h2 className="text-lg  leading-8 text-center text-gray-900">
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
