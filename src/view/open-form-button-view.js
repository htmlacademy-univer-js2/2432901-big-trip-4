import AbstractView from '../framework/view/abstract-view';
import { createOpenFormBtn } from '../templates/open-form-button-template';

export default class OpenFormBtnView extends AbstractView{
  #handleClick = null;

  constructor ({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createOpenFormBtn();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
