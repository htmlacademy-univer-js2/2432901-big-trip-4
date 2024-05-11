import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import FilterFormView from '../view/filter-view.js';
import FilterItemView from '../view/filter-item-view.js';
import TripInfoView from '../view/trip-info-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import { generateFilter } from '../mock/filters.js';
import PointPresenter from './point-presenter.js';
import { updateItem, sortByTime, sortByPrice } from '../utils.js';
import { RenderPosition, render } from '../framework/render.js';
import { SortType } from '../const.js';
import SortItemView from '../view/sort-item-view.js';

export default class TripPresenter {
  #eventListView = new EventListView();
  #emptyPointListView = new EmptyPointListView();
  #tripInfoView = new TripInfoView();
  #filterFormView = new FilterFormView();
  #sortView = new SortView();
  #pointPresenter = new Map();
  #container;
  #pointModel;
  #sortComponent;
  #tripPoint = [];
  #currentSortType = SortType.DAY;
  #points = [];
  #tripControls = document.querySelector('.trip-main__trip-controls');

  constructor ({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    this.#tripPoint = [...this.#pointModel.getPoints()];
    this.#points = [...this.#pointModel.getPoints()];

    const filterFormContainer = document.querySelector('.trip-controls__filters');
    const filters = generateFilter(this.#tripPoint);

    render(this.#filterFormView, filterFormContainer);
    render(this.#sortView, this.#container);

    Object.values(SortType).forEach((elem) => {
      this.#renderSort(elem);
    });

    filters.forEach((filter) => {
      render(new FilterItemView(filter), this.#filterFormView.element);
    });

    this.#renderPointsList();
  }

  #renderPoint (point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListView.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoint = updateItem(this.#tripPoint, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
    this.#points = updateItem(this.#tripPoint, updatedPoint);
  };


  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort (sort) {
    this.#sortComponent = new SortItemView({
      sort: sort,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#sortView.element);
  }

  #clearPointsList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #sortPoints(sortType) {
    switch(sortType) {
      case SortType.PRICE:
        this.#tripPoint.sort(sortByPrice);
        break;
      case SortType.TIME:
        this.#tripPoint.sort(sortByTime);
        break;
      default:
        this.#tripPoint = [...this.#points];
    }
    this.#currentSortType = sortType;
  }

  #renderPointsList() {
    if (this.#tripPoint.length > 0) {
      render(this.#tripInfoView, this.#tripControls, RenderPosition.BEFOREBEGIN);
      render(this.#eventListView, this.#container);

      this.#tripPoint.forEach((point) => {
        this.#renderPoint(point);
      });
    }
    else {
      render(this.#emptyPointListView, this.#container);
    }
  }
}
