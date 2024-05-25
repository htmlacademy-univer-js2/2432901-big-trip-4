import AbstractView from '../framework/view/abstract-view';
import { createNewPointTemplate } from '../templates/new-point-template';

export default class NewPointView extends AbstractView {
  #onClick = null;

  constructor({onClick}) {
    super();
    this.#onClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointTemplate();
  }

  #clickHandler = (event) => {
    event.preventDefault();
    this.#onClick();
  };
}
