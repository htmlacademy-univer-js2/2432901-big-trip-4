import { FilterTypes } from '../const.js';
import { createFilterItemTemplate } from './filter-item-template.js';

export function createFilterTemplate({ activeFilters, selectedFilter }) {
  return (`<form class="trip-filters" action="#" method="get">
      ${Object.values(FilterTypes).map((filter) => createFilterItemTemplate(filter, activeFilters.includes(filter), filter === selectedFilter)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}
