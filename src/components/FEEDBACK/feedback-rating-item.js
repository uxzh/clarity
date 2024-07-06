import React from "react";
import {
  VisuallyHidden,
  useRadio,
  useRadioGroupContext,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "./cn";

export let RatingValueEnum = /*#__PURE__*/ (function (RatingValueEnum) {
  RatingValueEnum["ANGRY"] = "angry";
  RatingValueEnum["BAD"] = "bad";
  RatingValueEnum["NEUTRAL"] = "neutral";
  RatingValueEnum["GOOD"] = "good";
  RatingValueEnum["GREAT"] = "great";

  return RatingValueEnum;
})({});

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

  const angryIconSize = 28; // Larger size for angry icon

  const iconData = React.useMemo(() => {
    switch (props.value) {
      case RatingValueEnum.ANGRY:
        return {
          icon: "fluent:emoji-angry-24-regular",
          color: "text-danger",
        };
      case RatingValueEnum.BAD:
        return {
          icon: "fluent-mdl2:emoji-disappointed",
          color: "text-warning",
        };
      case RatingValueEnum.NEUTRAL:
        return {
          icon: "fluent-mdl2:emoji-neutral",
          color: "text-foreground",
        };
      case RatingValueEnum.GOOD:
        return {
          icon: "fluent-mdl2:emoji-2",
          color: "text-primary",
        };
      case RatingValueEnum.GREAT:
        return {
          icon: "fluent-mdl2:emoji",
          color: "text-success",
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
      <Icon
        className={cn(
          "pointer-events-none transition-transform-colors",
          isSelected
            ? iconData.color
            : "text-default-400 dark:text-default-300",
          props.value === RatingValueEnum.ANGRY ? "text-2xl" : "",
          {
            "ring-2 ring-focus ring-offset-2 ring-offset-content1":
              isFocusVisible,
            "group-data-[pressed=true]:scale-90": !isReadOnly,
          }
        )}
        icon={iconData.icon}
        width={props.value === RatingValueEnum.ANGRY ? angryIconSize : iconSize}
      />
    </Component>
  );
});

FeedbackRatingItem.displayName = "FeedbackRatingItem";

export default FeedbackRatingItem;
