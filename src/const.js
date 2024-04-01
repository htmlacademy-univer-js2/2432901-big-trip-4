import { getRandomValue } from './utils.js';

const POINTS_COUNT = 5;
const CITIES_COUNT = 5;
const OFFERS_COUNT = 5;
const IMAGE_COUNT = 5;
const IMAGES = [];

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

const OFFERS = [
  'Add luggage',
  'Switch to comfort class',
  'Add meal',
  'Choose seats',
  'Travel by train'
];

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const IMAGE_URL = 'https://loremflickr.com/248/152?random=';

for (let i = 0; i < IMAGE_COUNT; i++) {
  IMAGES.push(`${IMAGE_URL}${getRandomValue()}`);
}

export {POINTS_COUNT, CITIES_COUNT, OFFERS_COUNT, IMAGE_COUNT, POINTS_TYPE, DESTINATIONS, OFFERS, DESCRIPTION, IMAGE_URL, IMAGES};
