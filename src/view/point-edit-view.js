import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_EMPTY } from '../const.js';
import { createPointEditViewTemplate } from '../templates/point-edit-template.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;

  #handleFormSubmit = null;
  #handleFormReset = null;
  #handleFormCancel = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  #isCreating = false;

  constructor({ point = POINT_EMPTY, destinations, offers, onFormSubmit, onFormReset, onFormCancel, isCreating = false }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormReset = onFormReset;
    this.#handleFormCancel = onFormCancel;
    this.#isCreating = isCreating;
    this._setState(PointEditView.parsePointToState({ point }));
    this._restoreHandlers();
  }

  get template() {
    return createPointEditViewTemplate({
      state: this._state,
      destinations: this.#destinations,
      offers: this.#offers,
      isCreating: this.#isCreating,
    });
  }

  reset = (point) => this.updateElement({ point });

  removeElement() {
    super.removeElement();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    const form = this.element.querySelector('form');
    this.#setDatepickers();
    if (this._state.isDisabled) {
      return;
    }

    form.addEventListener('submit', this.#formSubmitHandler);
    form.addEventListener('reset', this.#formResetHandler);
    if (!this.#isCreating) {
      form.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#formCancelHandler);
    }
    form.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    form.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    form.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
    form.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);
  }

  #setDatepickers() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const baseConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true,
      allowInput: true,
    };
    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...baseConfig,
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.point.dateTo,
      }
    );
    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...baseConfig,
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.point.dateFrom,
      }
    );
  }

  #typeChangeHandler = (evt) => {
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: [],
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations
      .find((destination) => destination.name === evt.target.value);
    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestination?.id || null,
      }
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.valueAsNumber,
      }
    });
  };

  #dateFromCloseHandler = ([date]) => {
    date ??= null;
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: date
      }
    });
    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  };

  #dateToCloseHandler = ([date]) => {
    date ??= null;
    this._setState({
      point: {
        ...this._state.point,
        dateTo: date
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #offerChangeHandler = () => {
    const checkedBoxes = [...this.element.querySelectorAll('.event__offer-checkbox:checked')];
    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId)
      }
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormReset(PointEditView.parseStateToPoint(this._state));
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormCancel();
  };

  static parsePointToState = ({ point }) => ({
    point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => state.point;
}
