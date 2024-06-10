import AbstractView from '../framework/view/abstract-view.js';
import { createPointViewTemplate } from '../templates/point-template.js';

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;

  #handleEditClick = null;
  #handleFavoriteClick = null;

  #rollupButton = null;
  #favoriteButton = null;

  constructor({ point, pointDestination, pointOffers, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = pointDestination;
    this.#offers = pointOffers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#rollupButton.addEventListener('click', this.#editClickHandler);
    this.#favoriteButton = this.element.querySelector('.event__favorite-btn');
    this.#favoriteButton.addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointViewTemplate({
      point: this.#point,
      pointDestination: this.#destination,
      pointOffers: this.#offers
    });
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  lock(){
    this.#rollupButton.disabled = true;
    this.#favoriteButton.disabled = true;
  }

  unlock() {
    this.#rollupButton.disabled = false;
    this.#favoriteButton.disabled = false;
  }
}
