import { POINTS_TYPES, ButtonText } from '../const.js';
import he from 'he';
import { getFullDate } from '../utils.js';

function createPointOptionsTemplate(destinations) {
  return ( `${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')} `);
}

function createPointPhotosTemplate(destination) {
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>`
  );
}

function createPointTypesTemplate(pointId, currentType, isActive) {
  return POINTS_TYPES.map((type) =>
    `<div class="event__type-item">
          <input id="event-type-${type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''} ${isActive ? '' : 'disabled'}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${pointId}" ${currentType === type ? 'checked' : ''}>${type[0].toUpperCase() + type.slice(1)}</label>
      </div>`).join('');
}

function createOffersTemplate(offers, selectedOffers, isActive) {
  const offerItems = offers.offers.map((offer) => {
    const offerName = offer.title.replace(' ', '').toLowerCase();
    return (`<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${offerName}" ${selectedOffers?.includes(offer.id) ? 'checked' : ''} ${isActive ? '' : 'disabled'}>
                <label class="event__offer-label" for="${offer.id}">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                </label>
            </div>`);
  }).join('');
  return `<div class="event__available-offers">${offerItems}</div>`;
}

function createDestinationTemplate( destination ) {
  return destination.description.length && destination.pictures.length ? `<section class="event__section  event__section--destination" >
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${destination.description.length ? `<p class="event__destination-description">${destination.description}</p>` : ''}
    ${destination.pictures.length ? createPointPhotosTemplate(destination) : ''}
  </section>` : '';
}

function createButtonTemplate(isCreating, isActive, isDeleting) {
  let text;
  if (isCreating) {
    text = ButtonText.CANCEL;
  }
  else {
    text = isDeleting ? ButtonText.LOAD_DELETE : ButtonText.DELETE;
  }
  return `<button class="event__reset-btn" type="reset" ${isActive ? '' : 'disabled'}>${text}</button>`;
}

export function createPointEditTemplate({ state, destinations, pointOffers, isCreating }) {
  const { point, isActive, isSaving, isDeleting } = state;
  const { id, price, dateFrom, dateTo, offers, type } = point;
  const currentDestination = destinations.find((destination) => destination.id === point.destination);
  const currentOffers = pointOffers.find((offer) => offer.type === type);
  const destinationName = (currentDestination) ? currentDestination.name : '';

  return (`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createPointTypesTemplate(id, type, isActive)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type[0].toUpperCase() + type.slice(1)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-${id}" ${isActive ? '' : 'disabled'}>
          <datalist id="destination-list-${id}"/>
            ${createPointOptionsTemplate(destinations)}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" ${point.dateFrom ? getFullDate(dateFrom) : ''} ${isActive ? '' : 'disabled'}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" ${point.dateTo ? getFullDate(dateTo) : ''} ${isActive ? '' : 'disabled'}>
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${he.encode(String(price))}" ${isActive ? '' : 'disabled'}>
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit" ${isActive ? '' : 'disabled'}>${isSaving ? ButtonText.LOAD_SAVE : ButtonText.SAVE}</button>
        ${createButtonTemplate(isCreating, isActive, isDeleting)}
        ${isCreating ? '' : `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          ${createOffersTemplate(currentOffers, offers, isActive)}
        </section>
        ${currentDestination ? `<section class="event__section  event__section--destination">
          ${createDestinationTemplate(currentDestination)}
        </section>` : ''}
      </section>
    </form>
  </li>`);
}
