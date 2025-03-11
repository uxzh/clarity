import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import {
  CardDetailsModal,
  CardEditModal,
  CardDeleteModal,
} from "../modals/CardModals";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useAdminContext } from "../contexts/AdminContext";
import { MODELS } from "../../../lib/models";
import { fetchAllPages } from "../utils";

export default function CardsTable() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { api } = useAuthContext();
  const { data, dispatchData } = useAdminContext();

  useEffect(() => {
    if (data[MODELS.cards].length !== 0) return;
    const fetchData = async () => {
      try {
        const data = await fetchAllPages(api.getCards, 50);
        dispatchData({ type: "set", model: MODELS.cards, data });
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { name: "NAME", uid: "cardName" },
    { name: "BANK", uid: "bankName" },
    { name: "RATING", uid: "bayesianRating" },
    { name: "REVIEWS", uid: "reviewCount" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (card, columnKey) => {
    switch (columnKey) {
      case "bayesianRating":
        return (
          <div className="flex items-center gap-1">
            <span>{card?.bayesianRating?.toFixed(1) || 'NaN'}</span>
            <span className="text-sm text-gray-500">
              ({card?.averageRating?.toFixed(1) || 'NaN'})
            </span>
          </div>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              color="secondary"
              onPress={() => {
                setSelectedCard(card);
                setDetailsModalOpen(true);
              }}
            >
              Details
            </Button>
            <Button
              size="sm"
              color="primary"
              onPress={() => {
                setSelectedCard(card);
                setEditModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color="danger"
              onPress={() => {
                setSelectedCard(card);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </Button>
          </div>
        );
      default:
        return card[columnKey];
    }
  };

  const handleSaveCard = async (cardData) => {
    try {
      const res = await api.updateCard(selectedCard._id, cardData);
      const card = res.data;
      dispatchData({ type: "update", model: MODELS.cards, data: card });
    } catch (error) {
      console.error("Error updating card:", error);
    }
    setEditModalOpen(false);
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await api.deleteCard(cardId);
      dispatchData({ type: "delete", model: MODELS.cards, _id: cardId });
    } catch (error) {
      console.error("Error deleting card:", error);
    }
    setDeleteModalOpen(false);
  };

  return (
    <>
      <Table aria-label="Cards table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={data[MODELS.cards]}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CardDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        card={selectedCard}
      />
      <CardEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        card={selectedCard}
        onSave={handleSaveCard}
      />
      <CardDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        card={selectedCard}
        onConfirm={handleDeleteCard}
      />
    </>
  );
}
