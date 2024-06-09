import Observable from '../framework/observable.js';
import { updateItem } from '../utils/common.js';
import { adaptToClient } from '../utils/adapt.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #apiService = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];

  constructor({apiService, destinationsModel, offersModel}) {
    super();
    this.#apiService = apiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get() {
    return this.#points;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const events = await this.#apiService.events;
      this.#points = events.map(adaptToClient);
      this._notify(UpdateType.INIT, {isError: false});
    } catch(err) {
      this.#points = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

  async updateEvent(updateType, update) {
    try {
      const response = await this.#apiService.updateEvent(update);
      const updatedEvent = adaptToClient(response);
      this.#points = updateItem(this.#points, updatedEvent);
      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error('Can\'t update event');
    }
  }


  async addEvent(updateType, update) {
    try {
      const response = await this.#apiService.addEvent(update);
      const newEvent = adaptToClient(response);
      this.#points.push(newEvent);
      this._notify(updateType, newEvent);
    } catch(err) {
      throw new Error('Can\'t add event');
    }
  }

  async deleteEvent(updateType, update) {
    try {
      await this.#apiService.deleteEvent(update);
      this.#points = this.#points.filter((eventItem) => eventItem.id !== update.id);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }
  }
}
