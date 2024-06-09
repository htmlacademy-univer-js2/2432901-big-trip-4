const DEFAULT_TYPE = 'flight';

const EmptyPoint = {
  price: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const TimePeriods = {
  MSEC_IN_SEC : 1000,
  SEC_IN_MIN : 60,
  MIN_IN_HOUR : 60,
  HOUR_IN_DAY : 24,
  MSEC_IN_HOUR : 60 * 60 * 1000,
  MSEC_IN_DAY : 24 * 60 * 60 * 1000,
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const EditingType = {
  UPDATE_POINT: 'update-point',
  ADD_POINT: 'add-point',
  DELETE_POINT: 'delete-point'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};

const ButtonText = {
  SAVE: 'Save',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  LOAD_SAVE: 'Saving...',
  LOAD_DELETE: 'Deleting...'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  EmptyPoint, TimePeriods, FilterType, Mode, SortType, EditingType, UpdateType, EditType, ButtonText , Method, TimeLimit};
