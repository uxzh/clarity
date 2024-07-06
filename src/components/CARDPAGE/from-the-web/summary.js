import React from "react";
import MessageCard from "./message-card";

export default function Component({ reviewFromTheWeb }) {
  return (
    <MessageCard
      showFeedback
      className="text-left"
      avatar="https://st5.depositphotos.com/72897924/62255/v/450/depositphotos_622556394-stock-illustration-robot-web-icon-vector-illustration.jpg"
      message={reviewFromTheWeb}
    />
  );
}
