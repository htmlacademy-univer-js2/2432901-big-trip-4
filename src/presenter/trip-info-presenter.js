import { render, remove, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #points = null;
  #tripInfoComponent = null;
  #tripInfoContainer = null;
  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  constructor({tripInfoContainer, destinationsModel, offersModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(events) {
    this.#points = events;
    this.#destinations = [...this.#destinationsModel.get()];
    this.#offers = [...this.#offersModel.get()];

    this.#tripInfoComponent = new TripInfoView({
      destinations: this.#destinations,
      offers: this.#offers,
      events: this.#points
    });

    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this.#tripInfoComponent);
  }
}
