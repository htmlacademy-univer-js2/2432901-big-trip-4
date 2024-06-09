import AbstractView from '../framework/view/abstract-view.js';
import { createNewPointButtonTemplate } from '../templates/new-point-template.js';
export default class NewPointView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
