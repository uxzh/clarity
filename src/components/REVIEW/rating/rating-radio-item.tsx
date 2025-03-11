"use client";

import type { RadioProps } from "@heroui/react";

import React, { useState } from "react";
import {
  VisuallyHidden,
  useRadio,
  useRadioGroupContext,
} from "@heroui/react";
import { IconStar, IconStarFilled, IconStarHalf } from "@tabler/icons-react";

import { cn } from "./cn.ts";

const RatingRadioItem = React.forwardRef<HTMLInputElement, RadioProps>(
  (props, ref) => {
    const {
      Component,
      isSelected: isSelfSelected,
      isFocusVisible,
      getBaseProps,
      getInputProps,
    } = useRadio(props);

    const groupContext = useRadioGroupContext();
    const [isHalfStar, setIsHalfStar] = useState(false);

    const isSelected =
      isSelfSelected ||
      Number(groupContext.groupState.selectedValue) >= Number(props.value);
    const isReadOnly = groupContext.groupState.isReadOnly;
    const size = props.size || groupContext.size || "md";

    const starWidth = React.useMemo(() => {
      switch (size) {
        case "sm":
          return 16;
        case "md":
          return 24;
        case "lg":
          return 32;
      }
    }, [size]);

    const handleClick = () => {
      if (isSelected) {
        setIsHalfStar(!isHalfStar);
      } else {
        setIsHalfStar(false);
      }
    };

    const baseProps = getBaseProps();

    return (
      <Component
        {...baseProps}
        ref={ref}
        className={cn(baseProps["className"], {
          "cursor-default": isReadOnly,
        })}
        onClick={handleClick}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        {isSelected ? (
          isHalfStar ? (
            <IconStarHalf
              className="pointer-events-none transition-transform-colors text-primary"
              width={starWidth}
            />
          ) : (
            <IconStarFilled
              className="pointer-events-none transition-transform-colors text-primary"
              width={starWidth}
            />
          )
        ) : (
          <IconStar
            className="pointer-events-none transition-transform-colors text-default-600"
            width={starWidth}
          />
        )}
      </Component>
    );
  }
);

RatingRadioItem.displayName = "RatingRadioItem";

export default RatingRadioItem;
