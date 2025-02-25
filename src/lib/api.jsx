class Api {
    constructor(axios) {
        this.axios = axios;
    }

    // cards
    getTopCards = async () => await this.axios.get(`/cards/top-cards`);

    getCard = async ({
        id,
        page = 0,
        perPage = 20,
    }) => await this.axios.get(`/cards/${id}?page=${page}&perPage=${perPage}`);

    getReviewsByCard = async ({
        cardId,
        sort = "createAt",
        sortDirection = -1,
        page = 0,
        perPage = 20
    }) => await this.axios.get(`/cards/${cardId}/reviews?page=${page}&perPage=${perPage}&sort=${sort}&sortDirection=${sortDirection}`);

    getCards = async ({page = 0, perPage = 20, search = ""}) =>
        await this.axios.get(
            `/cards?page=${page}&perPage=${perPage}&search=${search}`
        );

    getDefaultSearchCards = async ({page = 0, perPage = 10}) =>
        await this.axios.get(
            `/cards/default-search?page=${page}&perPage=${perPage}`
        );

    createCard = async (data) => await this.axios.post(`/cards`, data);

    updateCard = async (id, data) => await this.axios.put(`/cards/${id}`, data);

    deleteCard = async (id) => await this.axios.delete(`/cards/${id}`);

    // login
    login = async ({email, password}) =>
        await this.axios.post(`/auth/login`, {email, password});

    signup = async ({email, password, confirmPassword, username}) =>
        await this.axios.post(`/auth/signup`, {
            email,
            password,
            confirmPassword,
            username,
        });

    loginGoogle = async ({credential}) =>
        await this.axios.post(`/auth/login/google`, {credential});

    signupGoogle = async ({credential}) =>
        await this.axios.post(`/auth/signup/google`, {credential});

    // users
    getUsers = async ({page = 0, perPage = 20}) =>
        await this.axios.get(`/users?page=${page}&perPage=${perPage}`);

    getUser = async (id) => await this.axios.get(`/users/${id}`);

    updateUser = async (id, data) => await this.axios.put(`/users/${id}`, data);

    deleteUser = async (id) => await this.axios.delete(`/users/${id}`);

    checkUsername = async (username) => await this.axios.post(`/users/check-username/`, {username});

    // reviews
    getReviews = async ({page = 0, perPage = 20}) => await this.axios.get(`/reviews?page=${page}&perPage=${perPage}`);

    createReview = async ({cardId, title, content, rating, isAdminReview = false, username = null}) => {
        if (isAdminReview && username) {
            return await this.axios.post(`/reviews`, {cardId, title, content, rating, isAdminReview, username});
        }
        return await this.axios.post(`/reviews`, {cardId, title, content, rating});
    }

    updateReview = async (id, data) => await this.axios.put(`/reviews/${id}`, data);

    deleteReview = async (id) => await this.axios.delete(`/reviews/${id}`);

    likeReview = async (id, isLike) =>
        await this.axios.post(`/reviews/${id}/like`, {isLike});

    updateReviewLike = async (id, isLike) =>
        await this.axios.put(`/reviews/${id}/like`, {isLike});

    deleteReviewLike = async (id) =>
        await this.axios.delete(`/reviews/${id}/like`);

    // replies
    getRepliesByReviewId = async ({reviewId, context}) =>
        await this.axios.get(
            `/api/v1/replies/${reviewId}/replies/`
        );

    async createReply({ reviewId, content, parentReplyId = null }) {
        return this.axios.post('/replies/', { reviewId, content, parentReplyId });
    }
    async likeReply(replyId) {
        return this.axios.post(`/replies/${replyId}/like`);
    }

    async dislikeReply(replyId) {
        return this.axios.post(`/replies/${replyId}/dislike`);
    }

    async deleteReplyLike(replyId) {
        return this.axios.delete(`/replies/${replyId}/like`);

}

    // admin
    getTotals = async () => await this.axios.get(`/admin/totals`);
}

export default Api;
