import AbstractView from '../framework/view/abstract-view.js';
import { createEventListTemplate } from '../templates/event-list-template.js';

export default class EventListView extends AbstractView{
  get template() {
    return createEventListTemplate();
  }
}
