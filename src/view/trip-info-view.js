import AbstractView from '../framework/view/abstract-view.js';
import { getTripInfoTitle, getTripInfoDuration, getTotalTripCost } from '../utils/trip-info.js';
import { createTripInfoTemplate } from '../templates/trip-info-template.js';

export default class TripInfoView extends AbstractView {
  #destinations = null;
  #offers = null;
  #points = 0;

  constructor({destinations, offers, events}) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#points = events;
  }

  get template() {
    return createTripInfoTemplate({
      isEmpty: this.#points.length === 0,
      title: getTripInfoTitle(this.#points, this.#destinations),
      duration: getTripInfoDuration(this.#points),
      cost: getTotalTripCost(this.#points, this.#offers),
    });
  }
}
