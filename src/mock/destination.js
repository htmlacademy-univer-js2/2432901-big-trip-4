import { DESTINATIONS, DESCRIPTION } from '../const';
import { getRandomInteger, getRandomValue } from '../utils';

function generateDestination() {
  const city = getRandomValue(DESTINATIONS);

  return {
    id: crypto.randomUUID(),
    description: DESCRIPTION,
    name: city,
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      'src': `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      'description': `${city} description`
    }))
  };
}

export { generateDestination };
