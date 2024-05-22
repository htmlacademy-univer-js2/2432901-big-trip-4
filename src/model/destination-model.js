import {getCitiesArray} from '../mock/destination.js';

export default class DestinationModel {
  #cities = getCitiesArray();

  getCities() {
    return this.#cities;
  }

  getCityNameById(id) {
    let temp = '';
    this.#cities.forEach((city) => {
      if (city.id === id) {
        temp = city.name;
      }
    });
    return temp;
  }

  getCityDescriptionByID(id) {
    let temp = '';
    this.#cities.forEach((city) => {
      if (city.id === id) {
        temp = city.description;
      }
    });
    return temp;
  }

  getImagesByID(id) {
    let temp = '';
    this.#cities.forEach((city) => {
      if (city.id === id) {
        temp = city.images;
      }
    });
    return temp;
  }

  getIDByCityName(cityName) {
    let temp = '';
    this.#cities.forEach((city) => {
      if (city.name === cityName) {
        temp = city.id;
      }
    });
    return temp;
  }
}
