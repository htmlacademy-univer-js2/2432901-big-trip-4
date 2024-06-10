import AbstractView from '../framework/view/abstract-view.js';
import { createEventListViewTemplate } from '../templates/event-list-template.js';

export default class PointListView extends AbstractView {
  get template() {
    return createEventListViewTemplate();
  }
}
