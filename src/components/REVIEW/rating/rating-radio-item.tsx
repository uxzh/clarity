"use client";

import type { RadioProps } from "@nextui-org/react";

import React from "react";
import {
  VisuallyHidden,
  useRadio,
  useRadioGroupContext,
} from "@nextui-org/react";
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

    const baseProps = getBaseProps();

    return (
      <Component
        {...baseProps}
        ref={ref}
        className={cn(baseProps["className"], {
          "cursor-default": isReadOnly,
        })}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <IconStar
          className={cn(
            "pointer-events-none transition-transform-colors",
            isSelected ? "text-primary" : "text-default-600",
            {
              "ring-2 ring-focus ring-offset-2 ring-offset-content1":
                isFocusVisible,
              "group-data-[pressed=true]:scale-90": !isReadOnly,
            }
          )}
          width={starWidth}
        />
      </Component>
    );
  }
);

RatingRadioItem.displayName = "RatingRadioItem";

export default RatingRadioItem;
