import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EmptyPoint } from '../const.js';
import { createPointEditTemplate } from '../templates/point-edit-template.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


export default class PointEditView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #pointOffers = null;

  #handleFormSubmit = null;
  #handleCancelFormClick = null;
  #handleRollUpPointClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  #isCreating = null;

  constructor({point = EmptyPoint, destinations, pointOffers, isCreating = false, onRollUpPointClick, onFormSubmit, onCancelFormClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#pointOffers = pointOffers;
    this.#isCreating = isCreating;
    this.#handleRollUpPointClick = onRollUpPointClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCancelFormClick = onCancelFormClick;

    this._setState(PointEditView.parsePointToState({point}));
    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      state: this._state,
      destinations: this.#destinations,
      pointOffers: this.#pointOffers,
      isCreating: this.#isCreating,
    });
  }

  #rollUpPointClickHandler = (event) => {
    event.preventDefault();
    this.#handleRollUpPointClick();
  };

  #submitFormHandler = (event) => {
    event.preventDefault();
    this.#handleFormSubmit(this._state.point);
  };

  #cancelClickHandler = (event) => {
    event.preventDefault();
    this.#handleCancelFormClick(PointEditView.parseStateToPoint(this._state.point));
  };

  static parsePointToState(point) {
    return { ...point,
      isActive: true,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isActive;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  reset = (point) => this.updateElement({point});

  _restoreHandlers() {
    if (!this.#isCreating) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpPointClickHandler);
    }
    this.element.querySelector('form').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#changeOffersHandler);
    this.#setDatepicker();
  }

  #changeTypeHandler = (event) => {
    event.preventDefault();
    this.updateElement({
      point: {
        ...this._state.point,
        type: event.target.value,
        offers: []
      }
    });
  };

  #changeDestinationHandler = (event) => {
    const currentDestination = this.#destinations.find((destination) => destination.name === event.target.value);
    this.updateElement({
      point: {
        ...this._state.point,
        destination: currentDestination.id
      }
    });
  };

  #changePriceHandler = (event) => {
    this._setState({
      point: {
        ...this._state.point,
        price: event.target.valueAsNumber
      }
    });
  };

  #changeOffersHandler = () => {
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      point: {
        ...this._state.point,
        offers: checkedOffers.map((offer) => offer.id)
      }
    });
  };

  #setDatepicker = () => {
    const [dateFromElement, deteToElement] = this.element.querySelectorAll('.event__input--time');
    const dateConfig = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      locale: {
        firstDayOfWeek: 1
      },
      'time_24hr': true
    };
    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...dateConfig,
        defaultDate: this._state.point.dateFrom,
        maxDate: this._state.point.dateTo,
        onClose: this.#closeDateFromHandler
      }
    );
    this.#datepickerTo = flatpickr(
      deteToElement,
      {
        ...dateConfig,
        defaultDate: this._state.point.dateTo,
        minDate: this._state.point.dateFrom,
        onClose: this.#closeDateToHandler
      }
    );
  };

  #closeDateFromHandler = ([date]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: date
      }
    });
    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  };

  #closeDateToHandler = ([date]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: date
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateFrom);
  };

  removeElement = () => {
    super.removeElement();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };
}
