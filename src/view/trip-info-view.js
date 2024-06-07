import AbstractView from '../framework/view/abstract-view';
import { createTripInfoTemplate } from '../templates/trip-info-template';
import { getTotalTripCost, getTripInfoDuration, getTripInfoTitle } from '../utils';


export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate({
      isEmpty: this.#points.length === 0,
      title: getTripInfoTitle(this.#points, this.#destinations),
      duration: getTripInfoDuration(this.#points),
      cost: getTotalTripCost(this.#points, this.#offers)
    });
  }
}
