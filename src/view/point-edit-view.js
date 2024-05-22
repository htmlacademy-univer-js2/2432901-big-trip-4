import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createPointEditTemplate } from '../templates/point-edit-template.js';

export default class PointEditView extends AbstractStatefulView{
  #pointForm;
  #handleSubmit;
  #offerModel;
  #pointModel;

  constructor ({data, onSubmit, pointModel, offerModel}) {
    super();
    this._setState(PointEditView.parsePointToState(data));
    this.#handleSubmit = onSubmit;
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typeRouteToggleHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationToggleHandler);
    this.#offerModel = offerModel;
    this.#pointModel = pointModel;
  }

  get template() {
    return createPointEditTemplate(this._state);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #typeRouteToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: this.#pointModel.offerModel.updateOffers(evt.target.value)
    });
  };

  #destinationToggleHandler = (evt) => {
    evt.preventDefault();
    const cityID = this.#pointModel.cityModel.getIDByCityName(evt.target.value);
    this.updateElement({
      cityID: cityID,
      description: this.#pointModel.cityModel.getCityDescriptionByID(cityID),
      images: this.#pointModel.cityModel.getImagesByID(cityID)
    });
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    const point = {...state};
    return point;
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typeRouteToggleHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationToggleHandler);
  }
}
