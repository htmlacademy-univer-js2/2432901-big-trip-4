import dayjs from 'dayjs';
import { FilterType } from '../const.js';

function isPointPast(event) {
  return dayjs().isAfter(event.dateTo);
}

function isPointPresent(event) {
  return dayjs().isAfter(event.dateFrom) && dayjs().isBefore(event.dateTo);
}

function isPointFuture(event) {
  return dayjs().isBefore(event.dateFrom);
}

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => isPointFuture(event)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isPointPresent(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isPointPast(event)),
};

const EmptyPointListText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

export {filter, EmptyPointListText};
