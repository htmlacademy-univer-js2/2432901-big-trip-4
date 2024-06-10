import { POINT_TYPES} from '../const.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import he from 'he';

function createOffersTemplate({ pointId, selectedOffersIds, offers, isDisabled }) {
  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${he.encode(offer.id)}-${pointId}" type="checkbox" name="event-offer-${he.encode(offer.title)}"
              data-offer-id="${he.encode(offer.id)}" ${selectedOffersIds.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
            <label class="event__offer-label" for="event-offer-${he.encode(offer.id)}-${pointId}">
              <span class="event__offer-title">${he.encode(offer.title)}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${he.encode(String(offer.price))}</span>
            </label>
          </div>`).join('')}
      </div>
    </section>`;
}

function createDestinationTemplate({ destination }) {
  return destination.description.length || destination.pictures.length
    ? `
      <section class="event__section  event__section--destination" >
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        ${destination.description.length ? `<p class="event__destination-description">${he.encode(destination.description)}</p>` : ''}
        ${destination.pictures.length ? createPhotosTemplate({ pictures: destination.pictures }) : ''}
      </section>`
    : '';
}

function createPhotosTemplate({ pictures }) {
  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${he.encode(picture.src)}" alt="${he.encode(picture.description)}">`).join('')}
      </div>
    </div>`;
}

function createPointEditControlsTemplate({ isCreating, isDisabled, isSaving, isDeleting }) {
  const submitButtonText = isSaving ? 'Saving...' : 'Save';
  const deleteText = isDeleting ? 'Deleting...' : 'Delete';
  const resetButtonText = isCreating ? 'Cancel' : deleteText;

  return `
    <button class="event__save-btn  btn  btn--blue" ${isDisabled ? 'disabled' : ''} type="submit">
      ${submitButtonText}
    </button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
      ${resetButtonText}
    </button>
    ${isCreating ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'} `;
}

function createEventTypesTemplate({ pointId, eventTypes, selectedType }) {
  return `
    <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${eventTypes.map((type) => (`
            <div class="event__type-item">
              <input id="event-type-${type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === selectedType ? 'checked="checked"' : ''}>
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${pointId}">${capitalizeFirstLetter(type)}</label>
            </div>`)).join('')}
        </fieldset>
      </div>
    </div>`;
}

function createDestinationOptionsTemplate({ destinations }) {
  return destinations.map((destination) => `<option value="${he.encode(destination.name)}"></option>`).join('');
}

export function createPointEditViewTemplate({ state, destinations, offers, isCreating }) {
  const { point, isDisabled, isSaving, isDeleting } = state;
  const { offers: selectedOffersIds, destination: destinationId, basePrice } = point;
  const id = point.id && he.encode(point.id);
  const type = he.encode(point.type);
  const selectedDestination = destinationId && destinations.find((destination) => destination.id === destinationId);
  const suitableOffers = offers.find((offer) => offer.type === type).offers;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>
            ${createEventTypesTemplate({ pointId: id, eventTypes: POINT_TYPES, selectedType: type })}

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination"
              value="${selectedDestination ? he.encode(selectedDestination.name) : ''}" list="destination-list-${id}" ${isDisabled ? 'disabled' : ''} required>
            <datalist id="destination-list-${id}">
              ${createDestinationOptionsTemplate({ destinations })}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time"
              ${isDisabled ? 'disabled' : ''} required>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time"
              ${isDisabled ? 'disabled' : ''} required>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="number" min="0" name="event-price"
              value="${he.encode(String(basePrice))}" ${isDisabled ? 'disabled' : ''} required>
          </div>

          ${createPointEditControlsTemplate({ isCreating, isDisabled, isSaving, isDeleting })}

        </header>
        ${suitableOffers.length || (selectedDestination && (selectedDestination.description.length || selectedDestination.pictures.length)) ? `
          <section class="event__details">
            ${suitableOffers.length ? createOffersTemplate({ pointId: id, selectedOffersIds, offers: suitableOffers, isDisabled }) : ''}
            ${selectedDestination ? createDestinationTemplate({ destination: selectedDestination }) : ''}
          </section>` : ''}
      </form>
    </li>
  `;
}
