import AbstractView from '../framework/view/abstract-view';
import { createEmptyPointListTemplate } from '../templates/empty-point-list-template';
import { createLoadingTemplate } from '../templates/loading-template';
import { createFailedLoadingTemplate } from '../templates/failed-loading-template';

export default class EmptyPointListView extends AbstractView{
  #filterType = null;
  #isLoading = false;
  #isLoadingError = false;

  constructor({filterType, isLoading, isLoadingError}) {
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
    return createEmptyPointListTemplate(this.#filterType);
  }
}
