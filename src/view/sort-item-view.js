import AbstractView from '../framework/view/abstract-view.js';
import { createSortItemTemplate } from '../templates/sort-item-template.js';

export default class SortItemView extends AbstractView{
  #sort;
  #handleSortTypeChange;

  constructor ({sort, onSortTypeChange}) {
    super();
    this.#sort = sort;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.querySelector('label').addEventListener('click', this.#sortTypeChange);
  }

  get template() {
    return createSortItemTemplate(this.#sort);
  }

  #sortTypeChange = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
