import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Tooltip } from "@nextui-org/react";

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
    const ratingValue = isHalfFilled ? index + 0.5 : index + 1;
    const tooltipText = `${ratingValue} star${ratingValue > 1 ? "s" : ""}`;

    return (
      <Tooltip key={index} content={tooltipText}>
        <Icon
          icon={isFilled || isHalfFilled ? "solar:star-bold" : "solar:star-outline"}
          width={32}
          onClick={() => handleClick(index)}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          className={isFilled || isHalfFilled ? "text-primary" : "text-default-600"}
        />
      </Tooltip>
    );
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => renderStar(index))}
    </div>
  );
};

export default Stars;
