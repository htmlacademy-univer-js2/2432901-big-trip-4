import AbstractView from '../framework/view/abstract-view.js';
import { createFilterTemplate } from '../templates/filter-template.js';

export default class FilterView extends AbstractView {
  #activeFilters = [];
  #selected = null;
  #handleFilterTypeChange = null;

  constructor({ activeFilters, selectedFilter, onFilterTypeChange }) {
    super();
    this.#activeFilters = activeFilters;
    this.#selected = selectedFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change', this.#FilterTypeChangeHandler);
  }

  #FilterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.dataset.filterType);
  };

  get template() {
    return createFilterTemplate({ activeFilters: this.#activeFilters, selected: this.#selected });
  }
}
