import { FilterTypes } from '../const';
import Observable from '../framework/observable';

export default class FiltersModel extends Observable {
  #filter = FilterTypes.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  set(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
