import { EmptyPointListText } from '../utils/filter.js';

export function createMessageTemplate(filterType) {
  return `<p class="trip-events__msg">${EmptyPointListText[filterType]}</p>`;
}
