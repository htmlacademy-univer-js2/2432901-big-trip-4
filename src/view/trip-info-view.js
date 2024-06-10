import AbstractView from '../framework/view/abstract-view';
import { createTripInfoTemplate } from '../templates/trip-info-template';

export default class TripInfoView extends AbstractView {

  #short = false;
  #destinations = null;
  #dateFrom = null;
  #dateTo = null;
  #totalCost = 0;

  constructor({ short, destinations, dateFrom, dateTo, totalCost }) {
    super();
    this.#short = short;
    this.#destinations = destinations;
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#totalCost = totalCost;
  }

  get template() {
    return createTripInfoTemplate({
      short: this.#short,
      destinations: this.#destinations,
      dateFrom: this.#dateFrom,
      dateTo: this.#dateTo,
      totalCost: this.#totalCost,
    });
  }
}
