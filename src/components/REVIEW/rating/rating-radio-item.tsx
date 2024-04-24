"use client";

import type { RadioProps } from "@nextui-org/react";

import React from "react";
import {
  VisuallyHidden,
  useRadio,
  useRadioGroupContext,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

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
    const color = props.color || groupContext.color || "primary";

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

    const starColor = React.useMemo(() => {
      switch (color) {
        case "primary":
          return "text-primary";
        case "secondary":
          return "text-secondary";
        case "success":
          return "text-success";
        case "warning":
          return "text-warning";
        case "danger":
          return "text-danger";
        default:
          return "text-primary";
      }
    }, [color]);

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
        <Icon
          className={cn(
            "pointer-events-none transition-transform-colors",
            isSelected ? starColor : "text-default-600",
            {
              "ring-2 ring-focus ring-offset-2 ring-offset-content1":
                isFocusVisible,
              "group-data-[pressed=true]:scale-90": !isReadOnly,
            }
          )}
          icon="solar:star-bold"
          width={starWidth}
        />
      </Component>
    );
  }
);

RatingRadioItem.displayName = "RatingRadioItem";

export default RatingRadioItem;
