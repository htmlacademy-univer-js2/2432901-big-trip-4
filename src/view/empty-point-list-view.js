import AbstractView from '../framework/view/abstract-view.js';
import { createLoadingTemplate } from '../templates/loading-template.js';
import { createFailedLoadingTemplate } from '../templates/failed-loading-template.js';
import { createMessageTemplate } from '../templates/message-template.js';

export default class MessageView extends AbstractView {
  #filterType = null;
  #isLoading = false;
  #isLoadingError = false;

  constructor({filterType, isLoading = false, isLoadingError = false}) {
    super();
    this.#filterType = filterType;
    this.#isLoading = isLoading;
    this.#isLoadingError = isLoadingError;
  }

  get template() {
    if (this.#isLoading) {
      return createLoadingTemplate();
    }

    if (this.#isLoadingError) {
      return createFailedLoadingTemplate();
    }
    return createMessageTemplate(this.#filterType);
  }
}
