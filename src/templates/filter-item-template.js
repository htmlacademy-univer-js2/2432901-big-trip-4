export function createFilterItemTemplate(filter, activeFilter, checkedFilter) {
  return `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" data-filter-type="${filter}" value="${filter}"
        ${(checkedFilter ? 'checked' : '')} ${activeFilter ? '' : 'disabled'}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>`;
}
