import he from 'he';
import { EditType, ButtonText } from '../const.js';
import { firstLetterToUpperCase, firstLetterToLowerCase } from '../utils/common.js';
import { formatStringToDateTime } from '../utils/event.js';

function createEventTypesListElement(eventOffers, currentType, isDisabled) {
  return eventOffers.map((event) =>
    `<div class="event__type-item">
      <input id="event-type-${event.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event.type}" ${currentType === event.type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${event.type}" for="event-type-${event.type}-1">${firstLetterToUpperCase(event.type)}</label>
    </div>`).join('');
}

function createEventDestinationListElement(eventDestination) {
  return `
    <datalist id="destination-list-1">
      ${eventDestination.map((destination) => `<option value="${destination.name}"></option>`).join('')}
    </datalist>`;
}

function createEventOfferElement(offers, checkedOffers, isDisabled) {
  const offerItem = offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${firstLetterToLowerCase(offer.title)}" ${checkedOffers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');
  return `<div class="event__available-offers">${offerItem}</div>`;
}

function createEventPhotoElement(pictures) {
  return `${pictures.length ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>` : ''}`;
}

function createResetButtonTemplate(eventType, isDeleting, isDisabled) {
  let label;
  if (eventType === EditType.CREATING) {
    label = ButtonText .CANCEL;
  } else {
    label = isDeleting ? ButtonText .LOAD_DELETE : ButtonText .DELETE;
  }
  return `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${label}</button>`;
}

export function createPointEditTemplate({event, eventDestination, eventOffers, eventType}) {
  const { type, offers, dateFrom, dateTo, price, isDisabled, isSaving, isDeleting } = event;
  const currentOffers = eventOffers.find((offer) => offer.type === type);
  const currentDestination = eventDestination.find((destination) => destination.id === event.destination);
  const nameDestination = (currentDestination) ? currentDestination.name : '';
  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypesListElement(eventOffers, type, isDisabled)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(nameDestination)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            ${createEventDestinationListElement(eventDestination)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom ? formatStringToDateTime(dateFrom) : ''}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo ? formatStringToDateTime(dateTo) : ''}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(String(price))}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? ButtonText .LOAD_SAVE : ButtonText .SAVE}</button>
          ${createResetButtonTemplate(eventType, isDeleting, isDisabled)}
          ${(eventType === EditType.EDITING) ? '<button class="event__rollup-btn" type="button">' : ''}
        </header>
        <section class="event__details">
          ${(currentOffers.offers.length !== 0) ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            ${createEventOfferElement(currentOffers.offers, offers, isDisabled)}
          </section>` : ''}

          ${(currentDestination) ? `${(currentDestination.description.length || currentDestination.pictures.length) ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination.description}</p>
            ${createEventPhotoElement(currentDestination.pictures)}` : ''}
          </section>` : ''}
        </section>
      </form>
    </li>`;
}
