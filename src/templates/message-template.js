import { FilterType } from '../const.js';

export function createLoadingTemplate(isError) {
  const message = isError
    ? 'Failed to load latest route information'
    : 'Loading...';
  return createMessageTemplate(message);
}

export function createFilterMessageTemplate(filter) {
  const message = filter === FilterType.EVERYTHING
    ? 'Click New Event to create your first point'
    : `There are no ${filter} events now`;
  return createMessageTemplate(message);
}

function createMessageTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}
