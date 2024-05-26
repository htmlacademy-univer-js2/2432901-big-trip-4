export default class OffersModel {
  #apiService = null;
  #offers = null;

  constructor(apiService) {
    this.#apiService = apiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    this.#offers = await this.#apiService.offers;
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }
}
