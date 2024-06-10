import Observable from '../framework/observable';

export default class PointCreationStateModel extends Observable {
  #isCreating = false;

  get isCreating() {
    return this.#isCreating;
  }

  set isCreating(value) {
    if (this.#isCreating === value) {
      return;
    }
    this.#isCreating = value;
    this._notify(this.#isCreating);
  }
}
