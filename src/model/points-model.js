import { UpdateType } from '../const';
import Observable from '../framework/observable';
import { adaptToClient, adaptToServer, updatePoint } from '../utils';

export default class PointsModel extends Observable {
  #apiService = null;
  #points = [];
  #destinationsModel = null;
  #offersModel = null;

  constructor({apiService, destinationsModel, offersModel}) {
    super();
    this.#apiService = apiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const points = await this.#apiService.points;
      this.#points = points.map(adaptToClient);
      this._notify(UpdateType.INIT, {});
    } catch (err) {
      this.#points = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

  async add(updateType, point) {
    try {
      const adaptedPointToServer = adaptToServer(point);
      const response = await this.#apiService.addPoint(adaptedPointToServer);
      const newPoint = adaptToClient(response);
      this.#points.push(newPoint);
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async update(updateType, point) {
    try {
      const adaptedPointToServer = adaptToServer(point);
      const response = await this.#apiService.updatePoint(adaptedPointToServer);
      const updatedPoint = adaptToClient(response);
      this.#points = updatePoint(this.#points, updatedPoint);
      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async remove(updateType, point) {
    try {
      const adaptedPointToServer = adaptToServer(point);
      await this.#apiService.deletePoint(adaptedPointToServer);
      this.#points = this.#points.filter((item) => item.id !== point.id);
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }
}
