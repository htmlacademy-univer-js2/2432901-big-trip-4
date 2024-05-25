import { OFFERS, Price } from '../const';
import { getRandomInteger, getRandomValue } from '../utils';

function generateOffer() {
  const offer = getRandomValue(OFFERS);

  return {
    id: crypto.randomUUID(),
    title: offer,
    price: getRandomInteger(Price.MIN, (Price.MAX / 10))
  };
}

export { generateOffer };
