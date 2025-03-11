import React from "react";
import { Chip } from "@heroui/react";

export const Status = ({ status }) => {
  const getColorByStatus = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Chip size="sm" variant="flat" color={getColorByStatus(status)}>
      {status}
    </Chip>
  );
};
