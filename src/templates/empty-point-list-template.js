import { EmptyListText } from '../const';

export function createEmptyPointListTemplate(filterType) {
  return (`<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
    <p class="trip-events__msg">${EmptyListText[filterType]}</p>
    </section>`
  );
}
