export default class OffersModel {
  #service = null;
  #offers = [];

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#offers = await this.#service.offers;
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offersList) => offersList.type === type).offers;
  }

  getByTypeAndId(type, id) {
    return this.getByType(type).find((offer) => offer.id === id);
  }

}
