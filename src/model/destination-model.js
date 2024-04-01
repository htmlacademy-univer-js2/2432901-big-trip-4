import {getRandomDestination} from '../mock/destination.js';
import {CITIES_COUNT} from '../const.js';

export default class DestinationModel {
  #cities = Array.from({length: CITIES_COUNT}, getRandomDestination);

  getCities() {
    return this.#cities;
  }

  getCityNameById(cityArr, id) {
    let temp = '';
    cityArr.forEach((city) => {
      if (city.id === id) {
        temp = city.name;
      }
    });
    return temp;
  }

  getCityDescriptionByID(cityArr, id) {
    let temp = '';
    cityArr.forEach((city) => {
      if (city.id === id) {
        temp = city.description;
      }
    });
    return temp;
  }
}
