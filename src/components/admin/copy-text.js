// components/admin/copy-text.jsx
import React, { useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

export const CopyText = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span>{children}</span>
      <Tooltip content={copied ? "Copied!" : "Copy"}>
        <Button size="sm" variant="light" isIconOnly onPress={handleCopy}>
          {!copied ? (
            <Icon icon="solar:copy-linear" width={14} height={14} />
          ) : (
            <Icon icon="solar:check-read-linear" width={14} height={14} />
          )}
        </Button>
      </Tooltip>
    </div>
  );
};
