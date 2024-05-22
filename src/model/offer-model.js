import { OFFERS } from '../const.js';
import { getRandomArrayElement, getRandomValue } from '../utils.js';

export default class OfferModel {
  offers = [];
  constructor(type) {
    this.createOffers(type);
  }

  getOffers() {
    return this.offers;
  }

  getOfferByID(offersArr, id) {
    let temp = '';
    offersArr.forEach((offer) => {
      if (offer.id === id) {
        temp = offer;
      }
    });
    return temp;
  }

  getOffersIDs(offersArr) {
    this.offersIds = offersArr.map((offer) => offer.id);
    return this.offersIds;
  }

  updateOffers(newType) {
    this.createOffers(newType);
    return this.offers;
  }

  createOffers(type) {
    if (OFFERS[type] !== undefined) {
      OFFERS[type].forEach((offerName) => {
        this.offers.push({
          title: offerName,
          price: getRandomValue(),
          isChecked: getRandomArrayElement([0, 1])
        });
      });
    }
  }
}
