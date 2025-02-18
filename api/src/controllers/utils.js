const {ObjectId} = require("mongodb");
const LikesDAO = require("../dao/likesDAO");
const ReviewsDAO = require("../dao/reviewsDAO");

const getReviewsByCardIdWithLikes = async ({
    id,
    user,
    sort = "createdAt",
    sortDirection = -1,
    perPage,
    page
}) => {
    try {
        // TODO: optimize db queries
        const {reviews, totalReviewCount, ratingDistribution} = (await ReviewsDAO.getManyByField({
            field: "cardId",
            value: new ObjectId(id),
            sort,
            sortDirection,
            page,
            perPage,
        }))[0];
        const reviewIds = reviews.map((review) => review._id);
        const likes = await LikesDAO.getManyCountByTargetIds(reviewIds, 'review');
        const likesMap = likes.reduce((acc, like) => {
            acc[like._id] = {
                likes: like.isLike,
                dislikes: like.count - like.isLike
            }
            return acc;
        }, {});
        let userLikedReviewsMap = {};
        if (user) {
            const userLikedReviews = await LikesDAO.existUserLikes(reviewIds, user._id);
            userLikedReviewsMap = userLikedReviews.reduce((acc, like) => {
                acc[like.targetId] = like.isLike ? 1 : -1;
                return acc;
            }, {});
        }
        reviews.forEach((review) => {
            review.likes = likesMap[review._id]?.likes || 0;
            review.dislikes = likesMap[review._id]?.dislikes || 0;
            if (user) {
                review.likedByUser = userLikedReviewsMap[review._id] || 0;
            }

            if (!review.isAdminReview) return;
            delete review.isAdminReview;
            review.user = {...review.displayedUser};
            delete review.displayedUser;
        });
        return {
            reviews,
            totalReviewCount,
            ratingDistribution
        }
    } catch (e) {
        console.error(e)
        return {error: "Error fetching reviews"};
    }
}

module.exports = {
    getReviewsByCardIdWithLikes
}
