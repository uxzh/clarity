import {
  Badge,
  Button,
  Card,
  CardBody,
  Image,
  Skeleton,
} from "@nextui-org/react";
import { IconDotsVertical } from "@tabler/icons-react";

export default function CreditCard({
  imageLink,
  cashbackPercentage,
  bankName,
  cardName,
  index,
}) {
  return (
    <div className="flex justify-center items-center">
      <Badge
        size="lg"
        // display color primary if index is less than 3
        color={index < 1 ? "primary" : "default"}
        variant="shadow"
        // offset the position to the right and top
        className="px-2 py-1  right-[2%]"
        content={`${cashbackPercentage}%`}
        isInvisible={!cashbackPercentage > 0}
      >
        <Card className="w-[86vw] max-w-md sm:w-[80vw] sm:max-w-lg">
          <CardBody className="flex flex-row items-center">
            <Image className="max-w-20 rounded-md mr-2" src={imageLink} />
            <div className="flex-1 min-w-0 items-center">
              <h3 className="font-bold truncate sm:text-lg">{cardName}</h3>
              <p className="text-gray-500 truncate sm:text-base">{bankName}</p>
            </div>
            <div className="ml-[2vw] sm:ml-4">
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
  );
}
