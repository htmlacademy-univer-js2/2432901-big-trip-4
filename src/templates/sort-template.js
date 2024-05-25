export function createSortTemplate(sortTypes, currentSortType) {
  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortTypes.map(({ type, active }) => `
        <div class="trip-sort__item  trip-sort__item--${type}">
          <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${active !== -1 ? '' : 'disabled'} ${currentSortType === type ? 'checked' : ''}>
          <label class="trip-sort__btn" for="sort-${type}">${type}</label>
        </div>`).join('')}
    </form>`
  );
}
