import React, { useState, useEffect } from "react";
import { Avatar, Badge, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import { cn } from "./cn";

const MessageCard = React.forwardRef(
  ({ avatar, message, className, messageClassName, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsExpanded(!mediaQuery.matches);

      const handleResize = (e) => {
        setIsExpanded(!e.matches);
      };

      mediaQuery.addEventListener("change", handleResize);

      return () => {
        mediaQuery.removeEventListener("change", handleResize);
      };
    }, []);

    const toggleExpand = () => {
      setIsExpanded((prev) => !prev);
    };

    return (
      <div {...props} ref={ref} className={cn("flex gap-3", className)}>
        <div className="relative flex-none">
          <Badge color="primary" content={"bot"} variant="flat" size="sm">
            <Avatar src={avatar} />
          </Badge>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div
            className={cn(
              "relative w-full rounded-medium bg-content1 px-4 py-3 text-default-600",
              messageClassName
            )}
          >
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="absolute top-1 right-1"
              onClick={toggleExpand}
            >
              <Icon
                icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                width="20"
                height="20"
              />
            </Button>
            <div
              className={cn(
                "text-small",
                !isExpanded && "line-clamp-2 overflow-hidden"
              )}
            >
              {message}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default MessageCard;

MessageCard.displayName = "MessageCard";
