import { FilterTypes } from '../const';
import Observable from '../framework/observable';

export default class FiltersModel extends Observable {
  #filter = FilterTypes.EVERYTHING;

  set(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }

  get filter() {
    return this.#filter;
  }
}
