class Api {
  constructor(axios) {
    this.axios = axios
  }

  getTopCards = async () => await this.axios.get(`/cards/top-cards`);

}

export default Api;