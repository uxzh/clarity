import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Divider,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
  Textarea,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import FeedbackRating from "./feedback-rating";
import { AuthContext } from "../../contexts/AuthContext";
import { ratingToNumber } from "./feedback-rating-item";

export default function FeedbackModal({ isOpen, onOpenChange, cardName, onReviewSubmit }) {
  const location = useLocation();
  const cardId = new URLSearchParams(location.search).get("cardId");

  const { api } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e, onClose) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get("title"),
      content: formData.get("content"),
      rating: ratingToNumber(formData.get("rating")),
    };
    for (let [key, value] of Object.entries(data)) {
      if (!value) {
        console.error("Missing data:", key);
        setErrorMessage("All fields are required.");
        return;
      }
    }
    data.cardId = cardId;

    try {
      const response = await api.createReview(data);
      const newReview = response.data;
      onReviewSubmit(newReview);
      onClose();
    } catch (error) {
      setErrorMessage("Error submitting review. Please try again.");
      console.error("Error submitting review:", error);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      shouldBlockScroll={false}
      onOpenChange={onOpenChange}
      fullScreen={window.innerWidth <= 768} // Make full-screen on mobile
      className="my-auto"
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody>
            <ModalHeader className="flex-col items-center gap-1 px-0 text-center">
              <h1 className="text-xl">Review {cardName}</h1>
              <p className="text-small font-normal text-default-500">
                Help others make informed decisions.
              </p>
            </ModalHeader>
            <form
              className="flex w-full flex-col gap-2 mt-[-1rem]"
              onSubmit={(e) => handleSubmit(e, onClose)}
            >
              <Input
                type="title"
                variant="faded"
                label="Title"
                name="title"
                // placeholder="Short review title"
                labelPlacement="outside"
              />
              <Textarea
                aria-label="Review"
                minRows={12}
                name="content"
                labelPlacement="outside"
                placeholder={`

            • What I liked about this card.
            • What I didn't like about this card.
            • Who is this card perfect for?`}
                variant="faded"
              />
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <Spacer y={2} />
              <div className="flex w-full items-center justify-between pb-4">
                <FeedbackRating name="rating" size="lg" />
                <div className="flex gap-2">
                  <Button
                    color="danger"
                    type="button"
                    variant="flat"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
