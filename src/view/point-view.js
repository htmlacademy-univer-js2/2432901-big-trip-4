import AbstractView from '../framework/view/abstract-view.js';
import { createPointTemplate } from '../templates/point-template.js';

export default class PointView extends AbstractView{
  #point = null;
  #favouriteBtnClick = null;

  constructor ({data, onFavouriteClick}) {
    super();
    this.#point = data;
    this.#favouriteBtnClick = onFavouriteClick;
    this.element.querySelector('.event__favorite-icon').addEventListener('click', this.#clickFavouriteBtnHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  #clickFavouriteBtnHandler = (evt) => {
    evt.preventDefault();
    this.#favouriteBtnClick();
  };
}
