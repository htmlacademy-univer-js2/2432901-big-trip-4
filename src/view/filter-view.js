import AbstractView from '../framework/view/abstract-view.js';
import { createFilterTemplate } from '../templates/filter-template.js';
export default class FilterView extends AbstractView {
  #activeFilters = [];
  #selectedFilter = null;
  #onFilterTypeChange = null;

  #filterTypeChangeHandler = (event) => {
    event.preventDefault();
    this.#onFilterTypeChange?.(event.target.dataset.filterType);
  };

  constructor({activeFilters, selectedFilter, onFilterTypeChange}) {
    super();
    this.#activeFilters = activeFilters;
    this.#selectedFilter = selectedFilter;

    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate({
      activeFilters: this.#activeFilters,
      selectedFilter: this.#selectedFilter
    });
  }
}
