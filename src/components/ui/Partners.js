import { Image } from "@nextui-org/react";
import React from "react";

export default function Partners() {
  return (
    <div>
      <div className="h-full max-w-6xl px-8 pb-12 mx-auto md:px-12 lg:px-32">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <h2 className="text-lg font-semibold leading-8 text-center text-gray-900">
            We work with your favorite banks.
          </h2>
          <div className="grid items-center max-w-lg grid-cols-4 mx-auto mt-4 gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {/* Set a fixed height and use object-fit: contain for all images */}
            <div className="col-span-2 lg:col-span-1">
              <Image
                style={{ height: "48px", objectFit: "contain" }}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Bank_of_America_logo.svg/2560px-Bank_of_America_logo.svg.png"
                alt="Bank of America"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Image
                style={{ height: "48px", objectFit: "contain" }}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Chase_logo_2007.svg/1200px-Chase_logo_2007.svg.png"
                alt="Chase"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Image
                style={{ height: "48px", objectFit: "contain" }}
                className="rounded-none"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Citibank.svg/2560px-Citibank.svg.png"
                alt="Citibank"
              />
            </div>
            <div className="col-span-2 col-start-2 sm:col-start-auto lg:col-span-1">
              <Image
                className=" rounded-none"
                style={{ height: "48px", objectFit: "contain" }}
                src="https://seeklogo.com/images/G/goldman-sachs-logo-B826CAF741-seeklogo.com.png"
                alt="Goldman Sachs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
