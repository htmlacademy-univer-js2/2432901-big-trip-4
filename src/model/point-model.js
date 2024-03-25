import { OFFERS_COUNT, POINTS_COUNT } from '../const.js';
import {getRandomArrayElement, getRandomValue} from '../utils.js';
import {getRandomPoint} from '../mock/point.js';
import DestinationModel from '../model/destination-model.js';
import OfferModel from '../model/offer-model.js';

export default class PointModel {
  destinationModel = new DestinationModel();
  towns = this.destinationModel.getTowns();

  points = Array.from({length: POINTS_COUNT}, () => {
    const offerModel = new OfferModel(getRandomValue(0, OFFERS_COUNT));
    const offersArr = offerModel.getOffers();
    const offersID = offerModel.getOffersIDs(offersArr);
    const offers = [];
    offersID.forEach((offerID) => {
      offers.push(offerModel.getOfferByID(offersArr, offerID));
    });

    const townID = getRandomArrayElement(this.towns).id;

    const point = (getRandomPoint(townID, offersID));
    point.destination = this.destinationModel.getTownNameById(this.towns, townID);
    point.offers = offers;
    point.description = this.destinationModel.getTownDescByID(this.towns, townID);
    return point;
  });

  getPoints() {
    return this.points;
  }

  getPoint() {
    return this.points[0];
  }
}

