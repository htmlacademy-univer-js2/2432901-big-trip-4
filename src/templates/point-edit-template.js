import {POINTS_TYPE, DESTINATIONS} from '../const.js';
import { getFullDate } from '../utils.js';

function createPointEditTemplate (pointForm) {
  const offersArr = pointForm.offers !== undefined ? pointForm.offers : [];
  const imagesArr = pointForm.images;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointForm.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${POINTS_TYPE.map((type) => `<div class="event__type-item">
                <input id="event-type-${type.toLowerCase()}-1" class="event__${type.toLowerCase()}-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
                <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
              </div>`).join('')};
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${pointForm.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointForm.destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${DESTINATIONS.map((city) => `<option value="${city}"></option>`).join('')};
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getFullDate(pointForm.dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getFullDate(pointForm.dateTo)}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>
        <button class="event__reset-btn" type="reset">Delete</button>'
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${offersArr.map((offer) => `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}-1" type="checkbox" name="event-offer-${offer.title.toLowerCase()}" ${offer.isChecked ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase()}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`).join('')};
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointForm.description}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${imagesArr.map((img) => `<img class="event__photo" src="${img}.jpg" alt="Event photo">`).join('')};
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>
  `;

}

export {createPointEditTemplate};
