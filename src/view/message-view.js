import AbstractView from '../framework/view/abstract-view.js';
import { createFilterMessageTemplate, createLoadingTemplate } from '../templates/message-template.js';

export default class MessageView extends AbstractView {
  #filter = null;
  #isLoading = false;
  #isLoadingError = false;

  constructor({ filter, isLoading, isLoadingError }) {
    super();
    this.#filter = filter;
    this.#isLoading = isLoading;
    this.#isLoadingError = isLoadingError;
  }

  get template() {
    return this.#isLoading || this.#isLoadingError
      ? createLoadingTemplate(this.#isLoadingError)
      : createFilterMessageTemplate(this.#filter);
  }
}

