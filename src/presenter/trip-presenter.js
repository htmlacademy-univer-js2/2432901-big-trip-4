import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import FilterFormView from '../view/filter-form-view.js';
import FilterItemView from '../view/filter-item-view.js';
import TripInfoView from '../view/trip-info-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import { generateFilter } from '../mock/filters.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';
import { RenderPosition, render } from '../framework/render.js';

export default class TripPresenter {
  #eventListView = new EventListView();
  #emptyPointListView = new EmptyPointListView();
  #tripInfoView = new TripInfoView();
  #filterFormView = new FilterFormView();
  #sortView = new SortView();
  #pointPresenters = new Map();
  #container;
  #pointModel;
  #tripPoint = [];

  constructor ({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    this.#tripPoint = [...this.#pointModel.getPoints()];

    const tripControls = document.querySelector('.trip-main__trip-controls');
    const filterFormContainer = document.querySelector('.trip-controls__filters');
    const filters = generateFilter(this.#tripPoint);

    render(this.#filterFormView, filterFormContainer);

    for (let i = 0; i < filters.length; i++) {
      render(new FilterItemView(filters[i]), this.#filterFormView.element);
    }

    if (this.#tripPoint.length > 0) {
      render(this.#tripInfoView, tripControls, RenderPosition.BEFOREBEGIN);
      render(this.#sortView, this.#container);
      render(this.#eventListView, this.#container);

      for (let i = 0; i < this.#tripPoint.length; i++) {
        this.#renderPoint(this.#tripPoint[i]);
      }
    }

    else {
      render(this.#emptyPointListView, this.#container);
    }
  }

  #renderPoint (point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListView.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoint = updateItem(this.#tripPoint, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
