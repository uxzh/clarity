import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import "../../CSS/BentoGrid.css";

function NextUIGrid() {
  return (
    <div
      className="Grid mb-2"
      style={{ maxWidth: "1200px", textAlign: "center", margin: "0 auto" }}
    >
      <h2 className="text-xl font-semibold mb-2 text-center text-gray-900">
        Tools we offer
      </h2>
      <div className="grid auto-rows-[192px] grid-cols-3 gap-4">
        {[...Array(7)].map((_, i) => (
          <Card
            isPressable // This prop makes the card pressable
            key={i}
            className={`rounded-xl toolCard p-4 ${
              i === 3 || i === 6 ? "col-span-2" : ""
            }`}
          >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Card Title {i}</p>
              <small className="text-default-500">
                Description for card {i}...
              </small>
            </CardHeader>
            <CardBody className="overflow-hidden py-2">
              <Image
                alt={`Content ${i}`}
                className="object-cover rounded-xl"
                src={`https://assets-global.website-files.com/62967327a95717f82c12ca58/62a298520cc803153ade0c98_Credit%20card%20mockup%20white.png`}
                // width="100%"
                height="200px"
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default NextUIGrid;
