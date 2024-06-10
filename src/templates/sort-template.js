export function createSortTemplate(types, selected) {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${types.map(({ type, enabled }) =>`
        <div class="trip-sort__item  trip-sort__item--${type}">
          <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
            data-sort-type="${type}" value="sort-${type}" ${selected === type ? 'checked' : ''} ${enabled ? '' : 'disabled'}>
          <label class="trip-sort__btn" for="sort-${type}">${type}</label>
        </div>
      `).join('')}
    </form>`;
}
