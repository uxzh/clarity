import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Spacer, Button } from "@nextui-org/react";
import { IconCreditCardFilled } from "@tabler/icons-react";
import TopNavbar from "../components/navbar/activeNavbar";
import { FloatingCard } from "../components/ui/floatingCard";
import Banner from "../components/navbar/banner";
import Footer from "../components/footer/footer";
import ReviewsSection from "../components/CARDPAGE/ReviewsSection";
import CardDetails from "../components/CARDPAGE/CardDetails";
import { useDisclosure } from "@nextui-org/react";
import FeedbackModal from "../components/FEEDBACK/feedbackModal";
import ReviewSearch from "./searchForCard";
import { Spinner } from "@nextui-org/react";
import { AuthContext } from "../contexts/AuthContext";

function Review() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(
    new Set(["most_recent"])
  );
  const [selectedTab, setSelectedTab] = useState("reviews");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [fetchedPages, setFetchedPages] = useState({});

  const searchParams = new URLSearchParams(location.search);
  const cardId = searchParams.get("cardId");

  const { api } = useContext(AuthContext);

  useEffect(() => {
    if (!cardId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: selectedCard } = await api.getCard(cardId);
        setReviews(selectedCard.reviews || []);
        setCardData(selectedCard);
        setFetchedPages({ 1: selectedCard.reviews || [] });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        if (error.message === "Card not found") {
          navigate("/review");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cardId, navigate]);

  const fetchNextPage = useCallback(async (page) => {
    if (fetchedPages[page]) return;
    try {
      const { data: nextPageReviews } = await api.getReviews(cardId, page, reviewsPerPage);
      setFetchedPages((prev) => ({ ...prev, [page]: nextPageReviews }));
      setReviews((prev) => [...prev, ...nextPageReviews]);
    } catch (error) {
      console.error("Error fetching next page of reviews:", error);
    }
  }, [cardId, fetchedPages, reviewsPerPage]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchNextPage(currentPage + 1);
    }
  }, [currentPage, fetchNextPage]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return reviews.slice(startIndex, endIndex);
  }, [currentPage, reviews]);

  const handleWriteReview = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSelectionChange = useCallback((keys) => {
    if (keys.size === 0) return;
    setSelectedFilter(keys);
  }, []);

  const handleTabChange = useCallback((key) => {
    setSelectedTab(key);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  if (!cardId || error) return <ReviewSearch />;
  if (!cardData) return null;

  return (
    <div className="absolute top-0 z-[-2] min-h-screen w-[100%] bg-slate-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,119,198,0.3),rgba(255,255,255,0))]">
      <Banner />
      <TopNavbar />
      <div className="max-w-7xl md:mt-16 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 lg:mt-6 px-2 order-2 lg:order-1">
            <ReviewsSection
              reviews={paginatedReviews}
              handleWriteReview={onOpen}
              cardName={cardData.cardName}
              selectedFilter={selectedFilter}
              handleSelectionChange={handleSelectionChange}
              handleGoBack={handleGoBack}
              reviewFromTheWeb={cardData.reviewFromTheWeb}
              currentPage={currentPage}
              reviewsPerPage={reviewsPerPage}
              handlePageChange={handlePageChange}
            />
          </section>
          <section className="lg:col-span-1 lg:sticky lg:top-16 lg:h-screen lg:overflow-y-auto order-1 lg:order-2">
            <Card shadow="sm" className="p-4 pt-2 scale-95">
              <FloatingCard
                id="floatingCard"
                imgSrc={cardData.cardImageUrl}
                creditCardName={cardData.cardName}
                className="sm:w-[380px] lg:h-[200px]"
              />
              <div>
                <div className="pl-1">
                  <p className="text-md xs:mt-2 md:mt-0 md:text-left text-center text-gray-700">
                    {cardData.bankName}
                  </p>
                  <h2 className="text-2xl md:text-left  text-center font-black">
                    {cardData.cardName}
                  </h2>
                </div>
                <Spacer y={2} />
                <Button
                  style={{ border: "1px solid #1a202c" }}
                  target="_blank"
                  variant="bordered"
                  fullWidth
                  className="shadow-[0px_3px_0px_0px_#1a202c] font-bold hover:scale-105"
                  startContent={<IconCreditCardFilled stroke={1} />}
                >
                  Apply
                </Button>
                <Spacer y={4} />
                <CardDetails
                  selectedTab={selectedTab}
                  handleTabChange={handleTabChange}
                  cardData={cardData}
                  reviews={reviews}
                />
              </div>
            </Card>
          </section>
        </div>
      </div>
      <Footer />
      <FeedbackModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        cardName={cardData.cardName}
      />
    </div>
  );
}

export default Review;
