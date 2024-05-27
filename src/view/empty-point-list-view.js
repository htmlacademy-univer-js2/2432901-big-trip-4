import AbstractView from '../framework/view/abstract-view';
import { createEmptyPointListTemplate } from '../templates/empty-point-list-template';


export default class EmptyPointListView extends AbstractView{
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
      return '<p class="trip-events__msg">Loading...</p>';
    }
    if (this.#isLoadingError) {
      return '<p class="trip-events__msg">Failed to load latest route information</p>';
    }
    return createEmptyPointListTemplate(this.#filterType);
  }
}
