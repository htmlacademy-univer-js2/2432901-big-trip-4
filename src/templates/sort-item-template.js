const isAvailible = (sort) => (sort === 'event' || sort === 'offer' ? 'disabled' : '');

const isChecked = (sort) => (sort === 'day' ? 'checked' : '');

function createSortItemTemplate (sort) {
  return `<div class="trip-sort__item  trip-sort__item--${sort}">
  <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}" ${isAvailible(sort)} ${isChecked(sort)}>
  <label class="trip-sort__btn" for="sort-${sort}" data-sort-type="${sort}">${sort}</label>
</div>`;
}

export {createSortItemTemplate};
