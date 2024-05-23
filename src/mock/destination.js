import {getRandomArrayElement, getRandomValue} from '../utils.js';
import {DESTINATIONS, DESCRIPTION, IMAGE_COUNT} from '../const.js';

function getCitiesArray() {
  const cities = [];
  DESTINATIONS.forEach((city) => {
    cities.push({
      'id': crypto.randomUUID(),
      'name': city,
      'images': getRandomPhotos(),
      'description': getRandomArrayElement(DESCRIPTION.split('.')).repeat(getRandomValue(1, 5))
    });
  });
  return cities;
}

function getRandomPhotos () {
  const images = [];
  for (let i = 0; i < IMAGE_COUNT; i++){
    images.push(`https://loremflickr.com/248/152?random=${getRandomValue()}`);
  }
  return images;
}

export {getCitiesArray};
