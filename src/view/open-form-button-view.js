import AbstractView from '../framework/view/abstract-view';

function createOpenFormBtn() {
  return `<button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
  </button>`;
}

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
