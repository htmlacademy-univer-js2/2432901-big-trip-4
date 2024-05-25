import { formatStringToDateTime, formatStringToShortDate, formatStringToTime, getPointDuration } from '../utils.js';
import he from 'he';

function createPointOffersTemplate(offers, checkedOffers) {
  return (
    `<ul class="event__selected-offers">
        ${offers.offers.map((offerItem) => checkedOffers.offers.map((id) => id.id).includes(offerItem.id) ? `<li class="event__offer">
          <span class="event__offer-title">${offerItem.title}</span>
            &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerItem.price}</span>
          </li>` : '').join('')}
      </ul>`
  );
}

export function createPointTemplate(point, destinations, pointOffers) {
  const { basePrice, dateFrom, dateTo, isFavorite, offers, type } = point;
  const currentDestination = destinations.find((destination) => destination.id === point.destination.id);
  const destinationName = (currentDestination) ? currentDestination.name : '';

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime=${formatStringToDateTime(dateFrom)}>${formatStringToShortDate(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${he.encode(destinationName)}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime=${formatStringToDateTime(dateFrom)}>${formatStringToTime(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime=${formatStringToDateTime(dateTo)}>${formatStringToTime(dateTo)}</time>
      </p>
      <p class="event__duration">${getPointDuration(point)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>

    ${createPointOffersTemplate(pointOffers, offers)}

    <button class="event__favorite-btn ${favoriteClass}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
}
