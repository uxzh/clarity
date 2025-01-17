import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import * as yup from "yup";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useAdminContext } from "../contexts/AdminContext";
import { MODELS } from "../../../lib/models";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  cardId: yup.string().required("Card selection is required"),
});

const ReviewCreateModal = ({ isOpen, onClose }) => {
  const { api } = useAuthContext();
  const { data, dispatchData } = useAdminContext();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await api.getCards();
        setCards(res.data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchCards();
  }, []);

  const [formValues, setFormValues] = useState({
    username: "",
    title: "",
    content: "",
    cardId: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      const res = await api.createReview({
        ...formValues,
        isAdminReview: true,
      });
      dispatchData({ type: "add", model: MODELS.reviews, data: res.data });
      onClose();
    } catch (error) {
      if (error.inner) {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      } else {
        console.error("Error creating review:", error);
      }
    }
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Create Review</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Username"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                error={formErrors.username}
                required
              />
              <Input
                label="Title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                error={formErrors.title}
                required
              />
              <Textarea
                label="Content"
                name="content"
                value={formValues.content}
                onChange={handleChange}
                error={formErrors.content}
                required
              />
              <Select
                label="Card"
                name="cardId"
                value={formValues.cardId}
                onChange={handleChange}
                error={formErrors.cardId}
                required
              >
                {cards.map((card) => (
                  <SelectItem key={card._id} value={card._id}>
                    {card.cardName}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Create Review
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ReviewCreateModal;
