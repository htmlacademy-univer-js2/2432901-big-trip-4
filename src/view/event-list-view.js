import AbstractView from '../framework/view/abstract-view.js';
import { createEventListViewTemplate } from '../templates/event-list-template.js';

export default class EventsListView extends AbstractView {
  get template() {
    return createEventListViewTemplate();
  }
}

