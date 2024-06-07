import { RenderPosition, remove, render, replace } from '../framework/render';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #container = null;

  #points = null;
  #destinations = null;
  #offers = null;

  #destinationsModel = null;
  #offersModel = null;

  #tripInfoComponent = null;

  constructor({ container, destinationsModel, offersModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(points) {
    this.#points = points;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    if (this.#points.length === 0) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
      return;
    }

    const previousTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      destinations: this.#destinations,
      offers: this.#offers,
      points: this.#points
    });

    if (previousTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
    }
    else {
      replace(this.#tripInfoComponent, previousTripInfoComponent);
      remove(previousTripInfoComponent);
    }
  }

  destroy() {
    remove(this.#tripInfoComponent);
  }
}
