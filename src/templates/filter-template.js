import { capitalizeFirstLetter } from '../utils/common.js';
import { FilterType } from '../const.js';

export function createFilterTemplate({ activeFilters, selected }) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${Object.values(FilterType).map((filter) => createFilter(filter, activeFilters.includes(filter), filter === selected)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;

  function createFilter(filter, enabled, checked) {
    return `
      <div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          data-filter-type="${filter}" value="${filter}" ${enabled ? '' : 'disabled'} ${checked ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${capitalizeFirstLetter(filter)}</label>
      </div>`;
  }
}
