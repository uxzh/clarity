class Api {
  constructor(axios) {
    this.axios = axios;
  }

  // cards
  getTopCards = async () => await this.axios.get(`/cards/top-cards`);

  getCard = async (id) => await this.axios.get(`/cards/${id}`);

  getCards = async ({ page = 0, perPage = 20, search = "" }) =>
    await this.axios.get(
      `/cards?page=${page}&perPage=${perPage}&search=${search}`
    );

  getDefaultSearchCards = async ({ page = 0, perPage = 10 }) =>
    await this.axios.get(
      `/cards/default-search?page=${page}&perPage=${perPage}`
    );

  createCard = async (data) => await this.axios.post(`/cards`, data);

  updateCard = async (id, data) => await this.axios.put(`/cards/${id}`, data);

  deleteCard = async (id) => await this.axios.delete(`/cards/${id}`);

  // login
  login = async ({ email, password }) =>
    await this.axios.post(`/auth/login`, { email, password });

  signup = async ({ email, password, confirmPassword, username }) =>
    await this.axios.post(`/auth/signup`, {
      email,
      password,
      confirmPassword,
      username,
    });

  loginGoogle = async ({ credential }) =>
    await this.axios.post(`/auth/login/google`, { credential });

  signupGoogle = async ({ credential }) =>
    await this.axios.post(`/auth/signup/google`, { credential });

  // users
  getUsers = async ({ page = 0, perPage = 20 }) =>
    await this.axios.get(`/users?page=${page}&perPage=${perPage}`);

  getUser = async (id) => await this.axios.get(`/users/${id}`);

  updateUser = async (id, data) => await this.axios.put(`/users/${id}`, data);

  deleteUser = async (id) => await this.axios.delete(`/users/${id}`);

  checkUsername = async (username) => await this.axios.post(`/users/check-username/`, { username });

  // reviews
  getReviews = async ({ page = 0, perPage = 20 }) => await this.axios.get(`/reviews?page=${page}&perPage=${perPage}`);

  createReview = async ({ cardId, title, content, rating, isAdminReview = false, username = null }) => {
    if (isAdminReview && username) {
      return await this.axios.post(`/reviews`, { cardId, title, content, rating, isAdminReview, username });
    }
    return await this.axios.post(`/reviews`, { cardId, title, content, rating });
  }

  updateReview = async (id, data) => await this.axios.put(`/reviews/${id}`, data);

  deleteReview = async (id) => await this.axios.delete(`/reviews/${id}`);

  likeReview = async (id, isLike) =>
    await this.axios.post(`/reviews/${id}/like`, { isLike });

  updateReviewLike = async (id, isLike) =>
    await this.axios.put(`/reviews/${id}/like`, { isLike });

  deleteReviewLike = async (id) =>
    await this.axios.delete(`/reviews/${id}/like`);

  // replies
  getRepliesByReviewId = async ({ reviewId, page = 0, perPage = 20 }) =>
    await this.axios.get(
      `/reviews/${reviewId}/replies?page=${page}&perPage=${perPage}`
    );

  createReply = async ({ reviewId, content }) =>
    await this.axios.post(`/replies`, { reviewId, content });

  // admin
  getTotals = async () => await this.axios.get(`/admin/totals`);
}

export default Api;
