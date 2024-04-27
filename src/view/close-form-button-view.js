import AbstractView from '../framework/view/abstract-view';
import { createCloseFormBtn } from '../templates/close-form-button-template';

export default class CloseFormBtnView extends AbstractView{
  #handleClick = null;

  constructor ({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createCloseFormBtn();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
