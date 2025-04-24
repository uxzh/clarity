"use client";

import React from "react";
import { ScrollShadow } from "@heroui/react";

import { cn } from "./cn";

const ScrollingBanner = React.forwardRef(
  (
    {
      className,
      isReverse,
      isVertical = false,
      gap = "1rem",
      showShadow = true,
      shouldPauseOnHover = true,
      duration = 40,
      children,
      ...props
    },
    ref
  ) => {
    const shadowProps = {
      isEnabled: showShadow,
      offset: -20,
      size: 300,
      orientation: isVertical ? "vertical" : "horizontal",
      visibility: "both",
    };

    const content = React.Children.toArray(children);

    return (
      <ScrollShadow
        {...props}
        {...shadowProps}
        ref={ref}
        className={cn(
          "flex",
          {
            "w-full": !isVertical,
            "overflow-y-hidden": isVertical,
            "overflow-x-hidden": !isVertical,
            "max-h-[calc(100vh_-_200px)]": isVertical,
          },
          className
        )}
        style={{
          "--gap": gap,
          "--duration": `${duration}s`,
        }}
      >
        <div
          className={cn("flex w-max items-stretch gap-[--gap]", {
            "flex-col": isVertical,
            "h-full": isVertical,
            "animate-scrolling-banner": !isVertical,
            "animate-scrolling-banner-vertical": isVertical,
            "[animation-direction:reverse]": isReverse,
            "hover:[animation-play-state:paused]": shouldPauseOnHover,
          })}
        >
          {content}
          {content}
        </div>
      </ScrollShadow>
    );
  }
);

ScrollingBanner.displayName = "ScrollingBanner";

export default ScrollingBanner;
