import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";

export const ReviewEditModal = ({ isOpen, onClose, review, onSave }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: e.target.title.value,
      content: e.target.content.value,
      rating: parseInt(e.target.rating.value),
    });
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Review</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Title"
                name="title"
                defaultValue={review?.title}
                required
              />
              <Textarea
                label="Content"
                name="content"
                defaultValue={review?.content}
                required
              />
              <Input
                label="Rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                defaultValue={review?.rating}
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const ReviewHideModal = ({ isOpen, onClose, review, onConfirm }) => {
  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{review?.isHidden ? "Show" : "Hide"} Review</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to {review?.isHidden ? "show" : "hide"} this
            review?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="warning" onPress={() => onConfirm(review?._id)}>
            {review?.isHidden ? "Show" : "Hide"} Review
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ReviewDeleteModal = ({ isOpen, onClose, review, onConfirm }) => {
  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Review</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="danger" onPress={() => onConfirm(review?._id)}>
            Delete Review
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
