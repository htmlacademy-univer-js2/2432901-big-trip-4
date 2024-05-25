import { Price } from '../const';
import { getDate, getRandomInteger, getRandomValue } from '../utils';

function generatePoint(destinations, offers) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    destination: getRandomValue(destinations),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: offers,
    type: offers.type
  };
}

export { generatePoint };
