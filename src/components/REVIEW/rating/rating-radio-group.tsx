"use client";

import type { RadioGroupProps } from "@nextui-org/react";

import React from "react";
import { RadioGroup } from "@nextui-org/react";

import { cn } from "./cn.ts";

import RatingRadioItem from "./rating-radio-item.tsx";

export type RatingRadioGroupProps = RadioGroupProps & {
  hideStarsText?: boolean;
};

const RatingRadioGroup = React.forwardRef<
  HTMLDivElement,
  RatingRadioGroupProps
>(({ className, label, hideStarsText, ...props }, ref) => {
  const [value, setValue] = React.useState("1");
  //   const starsText = React.useMemo(() => {
  //     // Special case for 5 stars
  //     if (value === "5") {
  //       return "5 stars";
  //     }

  //     // For 1 to 4 stars, use a generic approach
  //     return `${value} stars & up`;
  //   }, [value]);
  const rating = "4.5";
  const starsText = (
    <>
      <span style={{ fontSize: "1.4em", marginRight: 8, color: "black" }}>
        {rating}
      </span>{" "}
      12 reviews
    </>
  );

  return (
    <div className={cn("items-center", className)}>
      {!hideStarsText && (
        <p className="text-medium text-default-400">{starsText}</p>
      )}
      <RadioGroup
        ref={ref}
        value={value}
        {...props}
        defaultValue="5"
        orientation="horizontal"
        onValueChange={setValue}
      >
        <RatingRadioItem value="1" />
        <RatingRadioItem value="2" />
        <RatingRadioItem value="3" />
        <RatingRadioItem value="4" />
        <RatingRadioItem value="5" />
      </RadioGroup>
      {label ? label : null}
    </div>
  );
});

RatingRadioGroup.displayName = "RatingRadioGroup";

export default RatingRadioGroup;
