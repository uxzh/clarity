import { useEffect, useState } from "react";
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
  ReviewEditModal,
  ReviewHideModal,
  ReviewDeleteModal,
} from "../modals/ReviewModals";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useAdminContext } from "../contexts/AdminContext";
import { fetchAllPages } from "../utils";
import { MODELS } from "../../../lib/models";

export default function ReviewsTable() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hideModalOpen, setHideModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { api } = useAuthContext();
  const { data, dispatchData } = useAdminContext();

  useEffect(() => {
    if (data[MODELS.reviews].length !== 0) return;
    const fetchData = async () => {
      try {
        const data = await fetchAllPages(api.getReviews, 50);
        dispatchData({ type: "set", model: MODELS.reviews, data });
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { name: "USER", uid: "user" },
    { name: "CARD", uid: "card" },
    { name: "RATING", uid: "rating" },
    { name: "TITLE", uid: "title" },
    { name: "CONTENT", uid: "content" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (review, columnKey) => {
    switch (columnKey) {
      case "user":
        return review.user.username;
      case "card":
        return review.card.cardName;
      case "rating":
        return (
          <div className="flex items-center gap-1">
            <span>{review.rating}</span>
            <span className="text-warning">★</span>
          </div>
        );
      case "content":
        return <div className="max-w-xs truncate">{review.content}</div>;
      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              color="primary"
              onPress={() => {
                setSelectedReview(review);
                setEditModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color="warning"
              onPress={() => {
                setSelectedReview(review);
                setHideModalOpen(true);
              }}
            >
              Hide
            </Button>
            <Button
              size="sm"
              color="danger"
              onPress={() => {
                setSelectedReview(review);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </Button>
          </div>
        );
      default:
        return review[columnKey];
    }
  };

  const handleSaveReview = (reviewData) => {
    console.log("Saving review:", reviewData);
    setEditModalOpen(false);
  };

  const handleHideReview = (reviewId) => {
    console.log("Hiding review:", reviewId);
    setHideModalOpen(false);
  };

  const handleDeleteReview = (reviewId) => {
    console.log("Deleting review:", reviewId);
    setDeleteModalOpen(false);
  };

  return (
    <>
      <Table aria-label="Reviews table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={data[MODELS.reviews]}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ReviewEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        review={selectedReview}
        onSave={handleSaveReview}
      />
      <ReviewHideModal
        isOpen={hideModalOpen}
        onClose={() => setHideModalOpen(false)}
        review={selectedReview}
        onConfirm={handleHideReview}
      />
      <ReviewDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        review={selectedReview}
        onConfirm={handleDeleteReview}
      />
    </>
  );
}
