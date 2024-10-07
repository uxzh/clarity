class Api {
  constructor(axios) {
    this.axios = axios
  }

  // cards
  getTopCards = async () => await this.axios.get(`/cards/top-cards`);

  getCard = async (id) => await this.axios.get(`/cards/${id}`);

  getCards = async ({ page = 0, perPage = 20, search = '' }) => await this.axios.get(`/cards?page=${page}&perPage=${perPage}&search=${search}`);

  // login
  login = async ({ email, password }) => await this.axios.post(`/auth/login`, { email, password });

  signup = async ({ email, password, confirmPassword, username }) => await this.axios.post(`/auth/signup`, { email, password, confirmPassword, username });

  // users
  getUser = async (id) => await this.axios.get(`/users/${id}`);

  // reviews
  createReview = async ({ cardId, title, content, rating }) => await this.axios.post(`/reviews`, { cardId, title, content, rating });

  likeReview = async (id, isLike) => await this.axios.post(`/reviews/${id}/like`, { isLike });

  updateReviewLike = async (id, isLike) => await this.axios.put(`/reviews/${id}/like`, { isLike });

  deleteReviewLike = async (id) => await this.axios.delete(`/reviews/${id}/like`);
}

export default Api;