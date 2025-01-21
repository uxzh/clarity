import React, { useState } from "react";
import { Icon } from "@iconify/react";

const Stars = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(undefined);

  const handleClick = (index) => {
    if (value === index + 1) {
      onChange(index + 0.5);
    } else if (value === index + 0.5) {
      onChange(index);
    } else {
      onChange(index + 1);
    }
  };

  const handleMouseOver = (index) => {
    setHoverValue(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const renderStar = (index) => {
    const isFilled = hoverValue ? hoverValue > index : value > index;
    const isHalfFilled = value === index + 0.5;

    return (
      <Icon
        key={index}
        icon={isFilled || isHalfFilled ? "solar:star-bold" : "solar:star-outline"}
        width={32}
        onClick={() => handleClick(index)}
        onMouseOver={() => handleMouseOver(index)}
        onMouseLeave={handleMouseLeave}
        className={isFilled || isHalfFilled ? "text-primary" : "text-default-600"}
      />
    );
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => renderStar(index))}
    </div>
  );
};

export default Stars;
