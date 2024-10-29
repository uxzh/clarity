import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import {
  CardDetailsModal,
  CardEditModal,
  CardDeleteModal,
} from "../modals/CardModals";
import { Status } from "../Status";
import { mockCards } from "../../../data/mockData";

export default function CardsTable() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
            <span>{card.bayesianRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">
              ({card.averageRating.toFixed(1)})
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

  const handleSaveCard = (cardData) => {
    console.log("Saving card:", cardData);
    setEditModalOpen(false);
  };

  const handleDeleteCard = (cardId) => {
    console.log("Deleting card:", cardId);
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
        <TableBody items={mockCards}>
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
