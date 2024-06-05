import AbstractView from '../framework/view/abstract-view';
import { createSortTemplate } from '../templates/sort-template';

export default class SortView extends AbstractView {
  #sortTypes = null;
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({ sortTypes, currentSortType, onSortTypeChange }) {
    super();
    this.#sortTypes = sortTypes;
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sortTypes, this.#currentSortType);
  }

  #sortTypeChangeHandler = (event) => {
    event.preventDefault();
    this.#handleSortTypeChange(event.target.value.split('-')[1]);
  };
}
