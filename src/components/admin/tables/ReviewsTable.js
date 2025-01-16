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
  ReviewEditModal,
  ReviewHideModal,
  ReviewDeleteModal,
} from "../modals/ReviewModals";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useAdminContext } from "../contexts/AdminContext";
import { MODELS } from "../../../lib/models";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";

export default function ReviewsTable() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hideModalOpen, setHideModalOpen] = useState(false);
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
      const response = await api.getReviews({ page: currentPage - 1, perPage });
      dispatchData({ type: "set", model: MODELS.reviews, data: response.data });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Error fetching reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useInfiniteScroll({
    loading,
    hasNextPage: data[MODELS.reviews].length === currentPage * perPage,
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
    threshold: 300,
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, perPage]);

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
      ) : data[MODELS.reviews].length === 0 ? (
        <div className="text-center">No reviews to display</div>
      ) : (
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
      )}

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
