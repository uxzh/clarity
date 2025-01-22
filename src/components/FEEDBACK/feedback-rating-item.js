import React from "react";
import {
  VisuallyHidden,
  useRadio,
  useRadioGroupContext,
} from "@nextui-org/react";
import { IconStar, IconStarFilled, IconStarHalf } from "@tabler/icons-react";

import { cn } from "./cn";

export let RatingValueEnum = /*#__PURE__*/ (function (RatingValueEnum) {
  RatingValueEnum["ANGRY"] = "angry";
  RatingValueEnum["BAD"] = "bad";
  RatingValueEnum["NEUTRAL"] = "neutral";
  RatingValueEnum["GOOD"] = "good";
  RatingValueEnum["GREAT"] = "great";

  return RatingValueEnum;
})({});

export const ratingToNumber = (rating) => {
  switch (rating) {
    case RatingValueEnum.ANGRY:
      return 1;
    case RatingValueEnum.BAD:
      return 2;
    case RatingValueEnum.NEUTRAL:
      return 3;
    case RatingValueEnum.GOOD:
      return 4;
    case RatingValueEnum.GREAT:
      return 5;
    default:
      return 0;
  }
};

const FeedbackRatingItem = React.forwardRef((props, ref) => {
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

  const iconSize = React.useMemo(() => {
    switch (size) {
      case "sm":
        return 16;
      case "md":
        return 20;
      case "lg":
        return 24;
    }
  }, [size]);

  const iconData = React.useMemo(() => {
    switch (props.value) {
      case RatingValueEnum.ANGRY:
        return {
          icon: IconStar,
          color: "text-default-400",
        };
      case RatingValueEnum.BAD:
        return {
          icon: IconStar,
          color: "text-default-400",
        };
      case RatingValueEnum.NEUTRAL:
        return {
          icon: IconStar,
          color: "text-default-400",
        };
      case RatingValueEnum.GOOD:
        return {
          icon: IconStar,
          color: "text-default-400",
        };
      case RatingValueEnum.GREAT:
        return {
          icon: IconStar,
          color: "text-default-400",
        };
    }
  }, [props.value]);

  const baseProps = getBaseProps();

  return (
    <Component
      {...baseProps}
      ref={ref}
      className={cn(baseProps?.["className"], {
        "cursor-default": isReadOnly,
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <iconData.icon
        className={cn(
          "pointer-events-none transition-transform-colors",
          isSelected
            ? "text-primary"
            : "text-default-400 dark:text-default-300",
          {
            "ring-2 ring-focus ring-offset-2 ring-offset-content1":
              isFocusVisible,
            "group-data-[pressed=true]:scale-90": !isReadOnly,
          }
        )}
        width={iconSize}
      />
    </Component>
  );
});

FeedbackRatingItem.displayName = "FeedbackRatingItem";

export default FeedbackRatingItem;
