import React, { useState } from "react";
import { IconStar, IconStarFilled, IconStarHalf, IconStarHalfFilled } from "@tabler/icons-react";
import { RadioGroup } from "@nextui-org/react";
import { cn } from "./cn";

const StarRating = ({ classNames, ...props }) => {
  const [ratings, setRatings] = useState([0, 0, 0, 0, 0]);

  const handleStarClick = (index) => {
    const newRatings = [...ratings];

    // If clicking on currently filled star
    if (newRatings[index] === 1) {
      newRatings[index] = 0.5;
      // Clear all stars after this one
      for (let i = index + 1; i < ratings.length; i++) {
        newRatings[i] = 0;
      }
    }
    // If clicking on half star, make it full
    else if (newRatings[index] === 0.5) {
      newRatings[index] = 1;
    }
    // If clicking on empty star or different position
    else {
      // Fill all stars up to and including clicked star
      for (let i = 0; i <= index; i++) {
        newRatings[i] = 1;
      }
      // Clear remaining stars
      for (let i = index + 1; i < ratings.length; i++) {
        newRatings[i] = 0;
      }
    }

    setRatings(newRatings);
  };

  const renderStar = (rating, index) => {
    if (rating === 1) {
      return (
        <IconStarFilled
          className="text-primary cursor-pointer"
          size={24}
          fill="currentColor"
          onClick={() => handleStarClick(index)}
        />
      );
    } else if (rating === 0.5) {
      return (
        <IconStarHalfFilled
          className="text-primary cursor-pointer"
          size={24}
          fill="currentColor"
          onClick={() => handleStarClick(index)}
        />
      );
    } else {
      return (
        <IconStar
          className="text-gray-300 cursor-pointer"
          size={24}
          onClick={() => handleStarClick(index)}
        />
      );
    }
  };

  return (
    <RadioGroup
      {...props}
      classNames={{
        ...classNames,
        base: cn(classNames?.base, "max-w-fit"),
        wrapper: cn(classNames?.wrapper, "flex gap-0"),
      }}
      orientation="horizontal"
      size="lg"
    >
      {ratings.map((rating, index) => (
        <div key={index} className="p-0.5">
          {renderStar(rating, index)}
        </div>
      ))}
    </RadioGroup>
  );
};

export default StarRating;
