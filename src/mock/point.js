import {getRandomArrayElement, getRandomValue, getDate} from '../utils.js';
import { POINTS_TYPE } from '../const.js';

function getRandomPoint(destinationID, offersID) {
  return ({
    'id': crypto.randomUUID(),
    'basePrice': getRandomValue(),
    'dateFrom': getDate({next: false}),
    'dateTo': getDate({next: true}),
    'destination': destinationID,
    'isFavorite': getRandomArrayElement([0, 1]),
    'offers': offersID,
    'type': getRandomArrayElement(POINTS_TYPE)
  });
}

export {getRandomPoint};
