import Observable from '../framework/observable';

export default class PointsModel extends Observable {
  #service = null;
  #points = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#points = this.#service.points;
  }

  get points() {
    return this.#points;
  }

  add(updateType, point) {
    this.#points.push(point);
    this._notify(updateType, point);
  }

  update(updateType, point) {
    const updatePoint = this.#points.findIndex((item) => item.id === point.id ? point : item);

    this.#points[updatePoint] = point;
    this._notify(updateType, point);
  }

  remove(updateType, point) {
    const index = this.#points.findIndex((item) => item.id === point.id);
    this.#points.splice(index, 1);
    this._notify(updateType, point);
  }
}
