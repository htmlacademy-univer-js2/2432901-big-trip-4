import { createElement } from '../render.js';
import { createFilterTemplate } from '../templates/filter-template.js';

export default class FilterFormView {
  getTemplate() {
    return createFilterTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
