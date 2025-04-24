import React, { useState, useEffect } from "react";
import { Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { IconBug } from "@tabler/icons-react";

export default function Component() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check localStorage when the component mounts
    const bannerClosed = localStorage.getItem("betaBannerClosed");
    if (bannerClosed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Set a flag in localStorage
    localStorage.setItem("betaBannerClosed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="flex w-full items-center gap-x-3 border-b-1 border-divider bg-primary px-3 py-2 sm:px-3.5 sm:before:flex-1">
      <p className="text-small text-primary-foreground">
        <Link className="text-inherit" href="#">
          We're in Beta. Found a bug?
        </Link>
      </p>
      <Button
        as={Link}
        className="group relative h-9 overflow-hidden bg-primary-foreground text-small font-medium text-primary"
        color="default"
        startContent={<IconBug stroke={2} />}
        onClick={() =>
          window.open(
            "mailto:cardsclarity@gmail.com?subject=CardsClarity Bug Report"
          )
        }
        radius="full"
      >
        Report
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          isIconOnly
          aria-label="Close Banner"
          className="-m-1"
          size="sm"
          variant="light"
          onClick={handleClose}
        >
          <Icon
            aria-hidden="true"
            className="text-primary-foreground"
            icon="lucide:x"
            width={20}
          />
        </Button>
      </div>
    </div>
  );
}
