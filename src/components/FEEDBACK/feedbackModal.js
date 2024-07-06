import React from "react";
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

export default function FeedbackModal({ isOpen, onOpenChange, cardName }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // const cardName = searchParams.get("cardName") || "this card";

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
              onSubmit={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              <Input
                type="title"
                variant="faded"
                label="Title"
                // placeholder="Short review title"
                labelPlacement="outside"
              />
              <Textarea
                aria-label="Review"
                minRows={12}
                name="review"
                labelPlacement="outside"
                placeholder={`

            • What I liked about this card.
            • What I didn't like about this card.
            • Who is this card perfect for?`}
                variant="faded"
              />
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
