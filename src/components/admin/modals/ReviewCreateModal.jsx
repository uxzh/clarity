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
import { useFormik } from "formik";
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

  const formik = useFormik({
    initialValues: {
      username: "",
      title: "",
      content: "",
      cardId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await api.createReview({
          ...values,
          isAdminReview: true,
        });
        dispatchData({ type: "add", model: MODELS.reviews, data: res.data });
        onClose();
      } catch (error) {
        console.error("Error creating review:", error);
      }
    },
  });

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader>Create Review</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && formik.errors.username}
                required
              />
              <Input
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && formik.errors.title}
                required
              />
              <Textarea
                label="Content"
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.content && formik.errors.content}
                required
              />
              <Select
                label="Card"
                name="cardId"
                value={formik.values.cardId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cardId && formik.errors.cardId}
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
