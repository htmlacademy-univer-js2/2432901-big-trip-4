import {getRandomArrayElement, getRandomValue} from '../utils.js';
import {POINTS_TYPE, OFFERS} from '../const.js';

function getRandomOffer() {
  return ({
    'id': crypto.randomUUID(),
    'type': getRandomArrayElement(POINTS_TYPE),
    'title': getRandomArrayElement(OFFERS),
    'price': getRandomValue()
  });
}

export {getRandomOffer};
