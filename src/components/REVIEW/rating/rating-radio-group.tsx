"use client";

import type { RadioGroupProps } from "@nextui-org/react";

import React, { useState } from "react";
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
  const [value, setValue] = useState("1");
  const [clickedStar, setClickedStar] = useState<number | null>(null);

  const starsText = React.useMemo(() => {
    if (value === "5") {
      return "5 stars";
    }
    return `${value} stars & up`;
  }, [value]);

  const handleStarClick = (starValue: number) => {
    if (clickedStar === starValue) {
      setClickedStar(null);
      setValue(starValue.toString());
    } else {
      setClickedStar(starValue);
      setValue(starValue.toString());
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <RadioGroup
        ref={ref}
        value={value}
        {...props}
        defaultValue="1"
        orientation="horizontal"
        onValueChange={setValue}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <RatingRadioItem
            key={star}
            value={star.toString()}
            onClick={() => handleStarClick(star)}
          />
        ))}
      </RadioGroup>
      {label ? label : null}
      {!hideStarsText && <p className="text-medium text-default-400">{starsText}</p>}
    </div>
  );
});

RatingRadioGroup.displayName = "RatingRadioGroup";

export default RatingRadioGroup;
