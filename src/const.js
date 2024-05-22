const POINTS_COUNT = 5;
const CITIES_COUNT = 5;
const OFFERS_COUNT = 5;
const IMAGE_COUNT = 5;

const DESTINATIONS = [
  'Amsterdam',
  'Chamonix',
  'Chicago',
  'Los Angeles',
  'Paris',
  'Perm'
];

const POINTS_TYPE = [
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

const OFFERS = {
  'taxi': ['Switch to comfort class', 'Switch to business class', 'Add luggage'],
  'bus': ['Add luggage'],
  'train': ['Switch to comfort class', 'Switch to business class', 'Choose seats', 'Add luggage', 'Add meal'],
  'ship': ['Switch to comfort class', 'Switch to business class', 'Choose seats', 'Add luggage', 'Add meal'],
  'drive': [],
  'flight': ['Switch to comfort class', 'Switch to business class', 'Choose seats', 'Add luggage', 'Add meal'],
  'check-in': [],
  'sightseeing': ['Travel by train', 'Add meal'],
  'restaurant': []
};
const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export { POINTS_COUNT, CITIES_COUNT, OFFERS_COUNT, IMAGE_COUNT, POINTS_TYPE, DESTINATIONS, OFFERS, DESCRIPTION, FilterType, Mode, SortType };
