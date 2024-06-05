import AbstractView from '../framework/view/abstract-view.js';
import { createPointTemplate } from '../templates/point-template.js';

export default class PointView extends AbstractView {
  #point = null;
  #destinations = null;
  #pointOffers = null;
  #handleEditPointClick = null;
  #handleFavoritePointClick = null;

  constructor({point, destinations, pointOffers, onEditPointClick, onFavoritePointClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#pointOffers = pointOffers;
    this.#handleEditPointClick = onEditPointClick;
    this.#handleFavoritePointClick = onFavoritePointClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editPointClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoritePointClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#pointOffers);
  }

  #editPointClickHandler = (event) => {
    event.preventDefault();
    this.#handleEditPointClick();
  };

  #favoritePointClickHandler = (event) => {
    event.preventDefault();
    this.#handleFavoritePointClick();
  };
}
