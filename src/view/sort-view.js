import AbstractView from '../framework/view/abstract-view.js';
import { createSortTemplate } from '../templates/sort-template.js';

export default class SortView extends AbstractView {

  #types = null;
  #selected = null;
  #handleTypeChange = null;

  constructor({ types, selected, onTypeChanged }) {
    super();
    this.#types = types;
    this.#selected = selected;
    this.#handleTypeChange = onTypeChanged;
    this.element.addEventListener('change', this.#typeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#types, this.#selected);
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleTypeChange(evt.target.dataset.sortType);
  };
}
