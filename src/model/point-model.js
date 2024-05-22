import { POINTS_COUNT } from '../const.js';
import {getRandomArrayElement} from '../utils.js';
import {getRandomPoint} from '../mock/point.js';
import DestinationModel from '../model/destination-model.js';
import OfferModel from '../model/offer-model.js';

export default class PointModel {
  destinationModel = null;
  offerModel = null;
  cities = null;
  points = null;

  constructor () {
    this.destinationModel = new DestinationModel();
    this.cities = this.destinationModel.getCities();
    this.points = Array.from({length: POINTS_COUNT}, () => {
      const cityID = getRandomArrayElement(this.cities).id;
      const point = (getRandomPoint(cityID));
      this.offerModel = new OfferModel(point.type);
      if (point.offers === 'not assigned') {
        point.offers = this.offerModel.getOffers();
      }
      else {
        this.offerModel.createOffers(point.offers);
        point.offers = this.offerModel.getOffers();
      }
      point.destination = this.destinationModel.getCityNameById(cityID);
      point.description = this.destinationModel.getCityDescriptionByID(cityID);
      point.images = this.destinationModel.getImagesByID(cityID);
      return point;
    });
  }

  getPoints() {
    return this.points;
  }

  getPoint() {
    return this.points[0];
  }
}
