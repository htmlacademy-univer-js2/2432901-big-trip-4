import AbstractView from '../framework/view/abstract-view.js';
import { createFilterTemplate } from '../templates/filter-template.js';
export default class FilterView extends AbstractView {
  #activeFilters = [];
  #selectedFilter = null;
  #handleFilterTypeChange = null;

  constructor({activeFilters, selectedFilter, onFilterTypeChange}) {
    super();
    this.#activeFilters = activeFilters;
    this.#selectedFilter = selectedFilter;

    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate({
      activeFilters: this.#activeFilters,
      selectedFilter: this.#selectedFilter
    });
  }

  #filterTypeChangeHandler = (event) => {
    event.preventDefault();
    this.#handleFilterTypeChange(event.target.value);
  };
}
