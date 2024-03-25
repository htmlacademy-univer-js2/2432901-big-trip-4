import {getRandomArrayElement, getRandomValue} from '../utils.js';
import {DESTINATIONS, DESCRIPTION} from '../const.js';

function getRandomDestination() {
  return ({
    'id': crypto.randomUUID(),
    'name': getRandomArrayElement(DESTINATIONS),
    'photo': `https://loremflickr.com/248/152?random=${getRandomValue()}`,
    'description': getRandomArrayElement(DESCRIPTION.split('.')).repeat(getRandomValue(1, 5))
  });
}

export {getRandomDestination};
