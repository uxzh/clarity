// feedbackModal.js
import React, { useContext, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
  Textarea,
} from "@nextui-org/react";

import FeedbackRating from "./feedback-rating";
import { AuthContext } from "../../contexts/AuthContext";
import { ratingToNumber } from "./feedback-rating-item";

export default function FeedbackModal({
  isOpen,
  onOpenChange,
  cardName,
  onReviewSubmit,
}) {
  const location = useLocation();
  const cardId = new URLSearchParams(location.search).get("cardId");
  const { api } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback((form) => {
    form.reset();
    setErrorMessage("");
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setErrorMessage("");

      const formData = new FormData(e.target);
      const data = {
        title: formData.get("title"),
        content: formData.get("content"),
        rating: ratingToNumber(formData.get("rating")),
        cardId: cardId,
      };

      for (let [key, value] of Object.entries(data)) {
        if (!value) {
          setErrorMessage("All fields are required.");
          setIsSubmitting(false);
          return;
        }
      }

      try {
        const response = await api.createReview(data);
        if (response.data) {
          onOpenChange(false);
          resetForm(e.target);
          onReviewSubmit(response.data);
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        setErrorMessage("Error submitting review. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [api, cardId, onReviewSubmit, onOpenChange, resetForm]
  );

  return (
    <Modal
      isOpen={isOpen}
      shouldBlockScroll={false}
      onOpenChange={onOpenChange}
      fullScreen={window.innerWidth <= 768}
      className="my-auto"
      isDismissable={false}
    >
      <ModalContent>
        {() => (
          <ModalBody>
            <ModalHeader className="flex-col items-center gap-1 px-0 text-center">
              <h1 className="text-xl">Review {cardName}</h1>
              <p className="text-small font-normal text-default-500">
                Help others make informed decisions.
              </p>
            </ModalHeader>
            <form
              className="flex w-full flex-col gap-2 mt-[-1rem]"
              onSubmit={handleSubmit}
            >
              <Input
                type="title"
                variant="faded"
                label="Title"
                name="title"
                labelPlacement="outside"
                isRequired
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
                isRequired
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
                    onPress={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                  >
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
