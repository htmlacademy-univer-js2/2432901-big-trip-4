import { DESTINATION_COUNT, OFFER_COUNT, POINT_COUNT, POINTS_TYPES } from '../const';
import { generateDestination } from '../mock/destination';
import { generateOffer } from '../mock/offer';
import { generatePoint } from '../mock/point';
import { getRandomInteger, getRandomValue } from '../utils';

export default class MockService {
  #destinations = [];
  #offers = [];
  #points = [];

  constructor() {
    this.#destinations = this.#generateDestinations();
    this.#offers = this.#generateOffers();
    this.#points = this.#generatePoints(this.destinations);
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }

  #generateDestinations() {
    return Array.from(
      {length: DESTINATION_COUNT},
      () => generateDestination()
    );
  }

  #generateOffers() {
    return POINTS_TYPES.map((type) => ({
      type,
      offers: Array.from({
        length:getRandomInteger(0, OFFER_COUNT)
      }, () => generateOffer())
    }));
  }

  #generatePoints(destinations) {
    return Array.from({length: getRandomInteger(0, POINT_COUNT)}, () => {
      const type = getRandomValue(POINTS_TYPES);
      const offersByType = this.#offers.find((offerByType) => offerByType.type === type);

      return generatePoint(destinations, offersByType);
    });
  }
}
