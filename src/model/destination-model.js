import {getRandomDestination} from '../mock/destination.js';
import {CITIES_COUNT} from '../const.js';

export default class DestinationModel {
  towns = Array.from({length: CITIES_COUNT}, getRandomDestination);

  getTowns() {
    return this.towns;
  }

  getTownNameById(townArr, id) {
    let temp = '';
    townArr.forEach((town) => {
      if (town.id === id) {
        temp = town.name;
      }
    });
    return temp;
  }

  getTownDescByID(townArr, id) {
    let temp = '';
    townArr.forEach((town) => {
      if (town.id === id) {
        temp = town.description;
      }
    });
    return temp;
  }
}
