import React from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Image,
  Chip,
  Badge,
  Button,
} from "@nextui-org/react";
import { IconDotsVertical } from "@tabler/icons-react";

export default function App() {
  const [selected, setSelected] = React.useState("photos");

  return (
    <div className="flex z-0 w-full h-full flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">Improve Your Wallet</h2>
      {walletSelector()}
      <div className="flex flex-row">
        <p className="flex items-center mr-2 w-8">#1</p>
        <Badge size="lg" variant="shadow" className="px-2 py-1" content="5%">
          <Card>
            <CardBody className="flex flex-row items-center">
              <Image
                className="max-w-20 rounded-md mr-2"
                src="https://www.bnc.ca/content/dam/bnc/particuliers/catalogue/cartes-credit/mycredit-card-300x190.png"
              />
              <div className="w-[284px] items-center">
                <h3 className="font-bold text-md">Chase Sapphire Preferred®</h3>
                <p className="text-gray-500 text-sm">Chase JP Morgan</p>
              </div>
              <div>
                <Button
                  variant="light"
                  isIconOnly
                  endContent={<IconDotsVertical stroke={2} />}
                />
              </div>
            </CardBody>
          </Card>
        </Badge>
      </div>
    </div>
  );

  function walletSelector() {
    return (
      <Tabs
        className="justify-center mb-6"
        aria-label="Options"
        // variant="light"
        selectedKey={selected}
        size="lg"
        color="black"
        onSelectionChange={setSelected}
      >
        <Tab key="photos" title="My Cards"></Tab>
        <Tab key="music" title="All Cards"></Tab>
      </Tabs>
    );
  }
}
