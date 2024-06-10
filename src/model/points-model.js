import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #service = null;
  #points = [];
  #destinationsModel = null;
  #offersModel = null;

  constructor(service, destinationsModel, offersModel) {
    super();
    this.#service = service;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      this.#points = await this.#service.points;
      this._notify(UpdateType.INIT, { isError: false });
    } catch {
      this.#points = [];
      this._notify(UpdateType.INIT, { isError: true });
    }
  }

  get() {
    return this.#points;
  }

  getById(id) {
    return this.#points.find((point) => point.id === id);
  }

  async add(updateType, point) {
    try {
      const newPoint = await this.#service.addPoint(point);
      this.#points.push(newPoint);
      this._notify(updateType, newPoint);
    } catch {
      throw Error('Can\'t add point');
    }
  }

  async update(updateType, point) {
    try {
      const updatedPoint = await this.#service.updatePoint(point);
      const index = this.#points.findIndex((current) => current.id === point.id);
      this.#points[index] = updatedPoint;
      this._notify(updateType, updatedPoint);
    } catch {
      throw Error('Can\'t update point');
    }

  }

  async remove(updateType, point) {
    try {
      await this.#service.deletePoint(point);
      const index = this.#points.findIndex((current) => current.id === point.id);
      this.#points.splice(index, 1);
      this._notify(updateType, point);
    } catch {
      throw Error('Can\'t remove point');
    }
  }
}
