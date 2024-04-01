import {getRandomOffer} from '../mock/offer.js';

export default class OfferModel {
  constructor(countOffers) {
    this.offers = Array.from({length: countOffers}, getRandomOffer);
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
}
