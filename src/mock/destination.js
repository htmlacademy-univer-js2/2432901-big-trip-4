import {getRandomArrayElement, getRandomValue, getRandomImages} from '../utils.js';
import {DESTINATIONS, DESCRIPTION} from '../const.js';

function getCitiesArray() {
  const cities = [];
  DESTINATIONS.forEach((city) => {
    cities.push({
      'id': crypto.randomUUID(),
      'name': city,
      'images': getRandomImages(),
      'description': getRandomArrayElement(DESCRIPTION.split('.')).repeat(getRandomValue(1, 5))
    });
  });
  return cities;
}


export {getCitiesArray};
