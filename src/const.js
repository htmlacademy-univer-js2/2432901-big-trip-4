import { isPointPast, isPointPresent, isPointFuture, sortByDay, sortByEvent, sortByOffers, sortByPrice, sortByTime } from './utils';

export const Duration = {
  HOUR: 5,
  DAY: 5,
  MINUTE: 59
};

export const POINTS_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

export const DEFAULT_TYPE = 'flight';

export const EmptyPoint = {
  price: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

export const FilterTypes = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future'
};

export const FilterOptions = {
  [FilterTypes.EVERYTHING]: (points) => [...points],
  [FilterTypes.PAST]: (points) => points.filter((point) => isPointPast(point)),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterTypes.FUTURE]: (points) => points.filter((point) => isPointFuture(point))
};

export const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

export const SortingOptions = {
  [SortTypes.DAY]: (points) => [...points].sort(sortByDay),
  [SortTypes.EVENT]: (points) => [...points].sort(sortByEvent),
  [SortTypes.TIME]: (points) => [...points].sort(sortByTime),
  [SortTypes.PRICE]: (points) => [...points].sort(sortByPrice),
  [SortTypes.OFFERS]: (points) => [...points].sort(sortByOffers)
};

export const ACTIVE_SORT_TYPES = [
  SortTypes.DAY,
  SortTypes.TIME,
  SortTypes.PRICE
];

export const PointMode = {
  DEFAULT: 'default',
  EDIT: 'edit'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

export const EditingType = {
  UPDATE_POINT: 'update-point',
  ADD_POINT: 'add-point',
  DELETE_POINT: 'delete-point'
};

export const EmptyListText = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.PAST]: 'There are no past events now'
};

export const ButtonText = {
  SAVE: 'Save',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  LOAD_SAVE: 'Saving...',
  LOAD_DELETE: 'Deleting...'
};

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export const FilterHasPoints = {
  [FilterTypes.EVERYTHING]: () => true,
  [FilterTypes.FUTURE]: (points) => points.some((point) => isPointFuture(point)),
  [FilterTypes.PRESENT]: (points) => points.some((point) => isPointPresent(point)),
  [FilterTypes.PAST]: (points) => points.some((point) => isPointPast(point))
};
