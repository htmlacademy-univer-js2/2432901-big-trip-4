import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EmptyPoint, EditType} from '../const.js';
import { createPointEditTemplate } from '../templates/point-edit-template.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class PointEditView extends AbstractStatefulView {
  #eventDestination = null;
  #eventOffers = null;
  #handleEditSubmit = null;
  #handleEditReset = null;
  #handleRollupClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #eventType;

  constructor({event = EmptyPoint, eventDestination, eventOffers, onEditSubmit, onEditReset, onRollupClick, eventType = EditType.EDITING}) {
    super();
    this.#eventDestination = eventDestination;
    this.#eventOffers = eventOffers;
    this.#handleEditSubmit = onEditSubmit;
    this.#handleEditReset = onEditReset;
    this.#handleRollupClick = onRollupClick;
    this.#eventType = eventType;

    this._setState(PointEditView.parseEventToState(event));
    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      event: this._state,
      eventDestination: this.#eventDestination,
      eventOffers: this.#eventOffers,
      eventType: this.#eventType
    });
  }

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

  reset(event) {
    this.updateElement(
      PointEditView.parseEventToState(event),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#editSubmitHandler);
    if (this.#eventType === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupClickHandler);
      this.element.querySelector('.event--edit')
        .addEventListener('reset', this.#editResetHandler);
    }
    if (this.#eventType === EditType.CREATING) {
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#editResetHandler);
    }
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.#setDatepickers();
  }

  #setDatepickers() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.dateTo,
      },
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom,
      },
    );
  }

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateFrom: userDate
    });

    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateTo: userDate
    });

    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #editSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditSubmit(PointEditView.parseStateToEvent(this._state));
  };

  #editResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditReset(PointEditView.parseStateToEvent(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #offerChangeHandler = () => {
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      ...this._state,
      offers: checkedBoxes.map((element) => element.id),
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#eventDestination.find((destination) => destination.name === evt.target.value);
    this.updateElement({
      destination: (selectedDestination) ? selectedDestination.id : null,
    });
  };

  #priceChangeHandler = (evt) => {
    if (isNaN(Number(evt.target.value))) {
      return this._state;
    }
    this._setState({
      ...this._state,
      price: evt.target.value,
    });
  };

  static parseEventToState(event) {
    return {...event,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToEvent(state) {
    const event = {...state};
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  }
}
