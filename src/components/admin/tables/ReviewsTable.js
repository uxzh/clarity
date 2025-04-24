import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Chip,
} from "@heroui/react";
import {
  ReviewEditModal,
  ReviewHideModal,
  ReviewDeleteModal,
} from "../modals/ReviewModals";
import ReviewCreateModal from "../modals/ReviewCreateModal";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useAdminContext } from "../contexts/AdminContext";
import { fetchAllPages } from "../utils";
import { MODELS } from "../../../lib/models";

export default function ReviewsTable() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hideModalOpen, setHideModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { api } = useAuthContext();
  const { data, dispatchData } = useAdminContext();

  useEffect(() => {
    if (data[MODELS.reviews].length !== 0) return;
    const fetchData = async () => {
      try {
        const data = await fetchAllPages(api.getReviews, 100);
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
    { name: "TYPE", uid: "type" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (review, columnKey) => {
    switch (columnKey) {
      case "user":
        return review?.displayedUser?.username || review.user.username;
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
      case "type":
        return <Chip
          color={review.isAdminReview ? "secondary" : "primary"}
          variant="flat"
          >{review.isAdminReview ? "Admin" : "User"}</Chip>;
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
              {review.isHidden ? "Show" : "Hide"}
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

  const handleSaveReview = async (reviewData) => {
    try {
      const res = await api.updateReview(selectedReview._id, reviewData);
      dispatchData({ type: "update", model: MODELS.reviews, data: res.data });
    } catch (error) {
      console.error("Error updating review:", error);
    }
    setEditModalOpen(false);
  };

  const handleHideReview = async (reviewId) => {
    try {
      await api.updateReview(reviewId, { isHidden: !selectedReview.isHidden });
      dispatchData({
        type: "update",
        model: MODELS.reviews,
        data: { ...selectedReview, isHidden: !selectedReview.isHidden },
      });
    } catch (error) {
      console.error("Error hiding review:", error);
    }
    setHideModalOpen(false);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.deleteReview(reviewId);
      dispatchData({ type: "delete", model: MODELS.reviews, _id: reviewId });
    } catch (error) {
      console.error("Error deleting review:", error);
    }
    setDeleteModalOpen(false);
  };

  return (
    <>
      <Button
        size="sm"
        color="primary"
        onPress={() => setCreateModalOpen(true)}
      >
        Create Review
      </Button>
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
      <ReviewCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}
