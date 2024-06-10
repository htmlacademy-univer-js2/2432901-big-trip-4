const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

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
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const ENABLED_SORT_TYPES = [
  SortTypes.DAY, SortTypes.TIME, SortTypes.PRICE
];

const UpdateType = {
  INIT: 'init',
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major',
};

const UserAction = {
  ADD_POINT: 'add-point',
  UPDATE_POINT: 'update-point',
  DELETE_POINT: 'delete-point',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const Url = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const PointMode = {
  DEFAULT: 'default',
  EDIT: 'edit',
};


const TimePeriods = {
  MSEC_IN_SEC : 1000,
  SEC_IN_MIN : 60,
  MIN_IN_HOUR : 60,
  HOUR_IN_DAY : 24,
  MSEC_IN_HOUR : 60 * 60 * 1000,
  MSEC_IN_DAY : 24 * 60 * 60 * 1000,
};

export { POINT_TYPES, EmptyPoint, FilterType, SortTypes, ENABLED_SORT_TYPES, UpdateType, UserAction, Method, Url, TimeLimit, PointMode, TimePeriods };
