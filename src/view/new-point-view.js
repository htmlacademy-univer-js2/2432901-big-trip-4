import AbstractView from '../framework/view/abstract-view';
import { createNewPointTemplate } from '../templates/new-point-template';

export default class NewPointView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointTemplate();
  }

  #clickHandler = (event) => {
    event.preventDefault();
    this.#handleClick();
  };
}
