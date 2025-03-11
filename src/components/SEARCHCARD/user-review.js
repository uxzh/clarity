import React from "react";
import { Avatar } from "@heroui/react";

import { cn } from "./cn";

const UserReview = React.forwardRef(
  ({ children, name, avatar, content, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-2.5 rounded-medium bg-content1 p-5 shadow-small select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Avatar alt={name} className="h-7 w-7" size="sm" src={avatar} />
        <span className="text-small text-foreground">{name}</span>
      </div>
      <p className="text-default-700">{content || children}</p>
    </div>
  )
);

UserReview.displayName = "UserReview";

export default UserReview;
