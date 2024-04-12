function createFilterItemTemplate (filter) {
  return `<div class="trip-filters__filter">
            <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" ${isAvailible(filter)} value="${filter.type}">
            <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
          </div>`;
}

function isAvailible(filter) {
  return filter.exists ? '' : 'disabled';
}

export {createFilterItemTemplate};
