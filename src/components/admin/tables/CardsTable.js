import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import {
  CardDetailsModal,
  CardEditModal,
  CardDeleteModal,
} from "../modals/CardModals";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useAdminContext } from "../contexts/AdminContext";
import { MODELS } from "../../../lib/models";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";

export default function CardsTable() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { api } = useAuthContext();
  const { data, dispatchData } = useAdminContext();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getCards({ page: currentPage - 1, perPage });
      dispatchData({ type: "set", model: MODELS.cards, data: response.data });
    } catch (error) {
      console.error("Error fetching cards:", error);
      setError("Error fetching cards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useInfiniteScroll({
    loading,
    hasNextPage: data[MODELS.cards].length === currentPage * perPage,
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
    threshold: 300,
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, perPage]);

  const columns = [
    { name: "NAME", uid: "cardName" },
    { name: "BANK", uid: "bankName" },
    { name: "RATING", uid: "bayesianRating" },
    { name: "REVIEWS", uid: "reviewCount" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (card, columnKey) => {
    switch (columnKey) {
      case "cardName":
        return (
          <div className="flex items-center gap-2">
            <img
              src={card.cardImageUrl}
              alt={card.cardName}
              className="w-8 h-8 object-contain"
              loading="lazy"
            />
            <span>{card.cardName}</span>
          </div>
        );
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
      <div className="flex justify-between items-center mb-4">
        <Select
          placeholder="Items per page"
          value={perPage}
          onChange={(value) => setPerPage(Number(value))}
          className="w-24"
        >
          <SelectItem value={10}>10</SelectItem>
          <SelectItem value={20}>20</SelectItem>
          <SelectItem value={50}>50</SelectItem>
          <SelectItem value={100}>100</SelectItem>
        </Select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : data[MODELS.cards].length === 0 ? (
        <div className="text-center">No cards to display</div>
      ) : (
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
      )}

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
