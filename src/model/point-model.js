import { OFFERS_COUNT, POINTS_COUNT } from '../const.js';
import {getRandomArrayElement, getRandomValue} from '../utils.js';
import {getRandomPoint} from '../mock/point.js';
import DestinationModel from '../model/destination-model.js';
import OfferModel from '../model/offer-model.js';

export default class PointModel {
  destinationModel = new DestinationModel();
  cities = this.destinationModel.getCities();

  points = Array.from({length: POINTS_COUNT}, () => {
    const offerModel = new OfferModel(getRandomValue(0, OFFERS_COUNT));
    const offersArr = offerModel.getOffers();
    const offersID = offerModel.getOffersIDs(offersArr);
    const offers = [];
    offersID.forEach((offerID) => {
      offers.push(offerModel.getOfferByID(offersArr, offerID));
    });

    const cityID = getRandomArrayElement(this.cities).id;

    const point = (getRandomPoint(cityID, offersID));
    point.destination = this.destinationModel.getCityNameById(this.cities, cityID);
    point.offers = offers;
    point.description = this.destinationModel.getCityDescriptionByID(this.cities, cityID);
    return point;
  });

  getPoints() {
    return this.points;
  }

  getPoint() {
    return this.points[0];
  }
}

