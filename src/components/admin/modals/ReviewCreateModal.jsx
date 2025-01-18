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
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Avatar,
} from "@nextui-org/react";
import * as yup from "yup";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useAdminContext } from "../contexts/AdminContext";
import { MODELS } from "../../../lib/models";
import { debounce } from "../../../lib/utils.ts";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  cardId: yup.string().required("Card selection is required"),
  rating: yup.number().required("Rating is required").min(1).max(5),
});

const ReviewCreateModal = ({ isOpen, onClose }) => {
  const { api } = useAuthContext();
  const { data, dispatchData } = useAdminContext();
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

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
    rating: "",
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
        setFormErrors({ general: "Error creating review. Please try again." });
      }
    }
  };

  const fetchSearchResults = debounce(async (term) => {
    if (!term.trim()) {
      setCards([]);
      return;
    }
    try {
      const { data } = await api.getCards({
        search: term,
        perPage: 20,
        page: 0,
      });
      setCards(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setCards([]);
    }
  }, 300);

  useEffect(() => {
    fetchSearchResults(searchTerm);
  }, [searchTerm]);

  const handleCardSelection = (cardId) => {
    const card = cards.find((card) => card._id === cardId);
    setSelectedCard(card);
    setFormValues({
      ...formValues,
      cardId: cardId,
    });
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setFormValues({
      ...formValues,
      username: value,
    });
    setAvatarUrl(`https://api.dicebear.com/6.x/notionists/svg?seed=${value}`);
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Create Review</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar src={avatarUrl} alt="User Avatar" />
                <Input
                  label="Username"
                  name="username"
                  value={formValues.username}
                  onChange={handleUsernameChange}
                  error={formErrors.username}
                  required
                />
              </div>
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
                label="Rating"
                name="rating"
                value={formValues.rating}
                onChange={(value) =>
                  setFormValues({ ...formValues, rating: value })
                }
                error={formErrors.rating}
                required
              >
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    {rating}
                  </SelectItem>
                ))}
              </Select>
              <Autocomplete
                label="Card"
                items={cards}
                inputValue={searchTerm}
                onInputChange={(value) => setSearchTerm(value)}
                onSelectionChange={handleCardSelection}
                error={formErrors.cardId}
                required
              >
                {(item) => (
                  <AutocompleteItem key={item._id} textValue={item.cardName}>
                    <div className="flex items-center">
                      <img
                        src={item.cardImageUrl}
                        alt={item.cardName}
                        className="w-16 h-10 object-contain mr-3"
                      />
                      <div className="flex flex-col">
                        <span className="text-small font-bold">
                          {item.cardName}
                        </span>
                        <span className="text-tiny text-default-400">
                          {item.bankName}
                        </span>
                      </div>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
              {selectedCard && (
                <div className="mt-2">
                  <strong>Selected Card:</strong> {selectedCard.cardName}
                </div>
              )}
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
