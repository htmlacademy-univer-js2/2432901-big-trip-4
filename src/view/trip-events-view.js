import AbstractView from '../framework/view/abstract-view.js';
import { createTripEventsTemplate } from '../templates/trip-events-template.js';

export default class TripEventsView extends AbstractView {
  get template() {
    return createTripEventsTemplate();
  }
}
