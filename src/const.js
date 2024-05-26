import { isPointPast, isPointPresent, isPointFuture, sortByDay, sortByEvent, sortByOffers, sortByPrice, sortByTime } from './utils';

export const DESTINATION_COUNT = 5;
export const POINT_COUNT = 5;
export const OFFER_COUNT = 5;

export const Price = {
  MIN: 1,
  MAX: 1000
};

export const Duration = {
  HOUR: 5,
  DAY: 5,
  MINUTE: 59
};

export const DESTINATIONS = [
  'Amsterdam',
  'Chamonix',
  'Chicago',
  'Los Angeles',
  'Paris',
  'Perm'
];

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

export const OFFERS = [
  'Order Uber',
  'Add luggage',
  'Rent a car',
  'Add meal',
  'Switch to comfort class',
  'Switch to a business class'
];

export const DEFAULT_TYPE = 'flight';

export const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.';

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
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const FilterOptions = {
  [FilterTypes.EVERYTHING]: (points) => [...points],
  [FilterTypes.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterTypes.PAST]: (points) => points.filter((point) => isPointPast(point))
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
  [FilterTypes.FUTURE]: 'There are no future events',
  [FilterTypes.PRESENT]: 'There are no present events',
  [FilterTypes.PAST]: 'There are no past events'
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
