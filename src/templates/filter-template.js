import { firstLetterToUpperCase } from '../utils/common.js';

function createFilterItemTemplate(filter, currentFilter) {
  const {type, exists} = filter;
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${currentFilter === type ? 'checked' : ''} ${exists ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${type}">${firstLetterToUpperCase(type)}</label>
    </div>`;
}

export function createFilterTemplate(filterItems, currentFilter) {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilter)).join('');
  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}
