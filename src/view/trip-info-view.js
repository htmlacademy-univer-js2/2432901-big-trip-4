import AbstractView from '../framework/view/abstract-view.js';
import { getTripInfoTitle, getTripInfoDuration, getTotalTripCost } from '../utils/trip-info.js';
import { createTripInfoTemplate } from '../templates/trip-info-template.js';

export default class TripInfoView extends AbstractView {
  #destinations = null;
  #offers = null;
  #events = 0;

  constructor({destinations, offers, events}) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#events = events;
  }

  get template() {
    return createTripInfoTemplate({
      isEmpty: this.#events.length === 0,
      title: getTripInfoTitle(this.#events, this.#destinations),
      duration: getTripInfoDuration(this.#events),
      cost: getTotalTripCost(this.#events, this.#offers),
    });
  }
}
