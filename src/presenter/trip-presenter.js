import SortView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import { RenderPosition, remove, render } from '../framework/render';
import EmptyPointListView from '../view/empty-point-list-view';
import PointPresenter from './point-presenter';
import { sortByDay, sortByPrice, sortByTime, updatePoint } from '../utils';
import { ACTIVE_SORT_TYPES, FilterOptions, FilterTypes, SortTypes, SortingOptions, UpdateType, EditingType } from '../const';
import NewPointPresenter from './new-point-presenter';


export default class TripPresenter {
  #container = null;
  #offersModel = null;
  #pointsModel = null;
  #destinationsModel = null;
  #filtersModel = null;

  #points = [];

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #sortComponent = null;
  #emptyListComponent = null;
  #eventListComponent = new EventListView();

  #currentSortType = SortTypes.DAY;
  #filterType = FilterTypes.EVERYTHING;

  constructor({container, offersModel, pointsModel, destinationsModel, filtersModel, onNewPointDestroy}) {
    this.#container = container;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#filtersModel = filtersModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#actionViewChangeHandler,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filtersModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = FilterOptions[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortTypes.TIME:
        filteredPoints.sort(sortByTime);
        break;
      case SortTypes.PRICE:
        filteredPoints.sort(sortByPrice);
        break;
      default:
        filteredPoints.sort(sortByDay);
        break;
    }
    return filteredPoints;
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    if (this.points.length === 0) {
      this.#renderEmptyListView();
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#container);
    this.#renderPoints();
  }

  #renderSort = () => {
    const sortTypes = Object.values(SortTypes).map((sortType) => ({
      type: sortType,
      active: ACTIVE_SORT_TYPES.indexOf(sortType)
    }));


    this.#sortComponent = new SortView({
      sortTypes: sortTypes,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    render(this.#sortComponent, this.#container);
  };

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = SortingOptions[this.#currentSortType](this.#points);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#actionViewChangeHandler,
      onModeChange: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderEmptyListView = () => {
    this.#emptyListComponent = new EmptyPointListView({
      filterType: this.#filterType
    });

    render(this.#emptyListComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  createPoint = () => {
    this.#currentSortType = SortTypes.DAY;
    this.#filtersModel.set(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newPointPresenter.init();
  };

  #clearTrip = ({ resetSort = false } = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetSort) {
      this.#currentSortType = SortTypes.DAY;
    }
  };

  #pointDataChangeHandler = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #actionViewChangeHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case EditingType.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case EditingType.ADD_POINT:
        this.#pointsModel.add(updateType, update);
        break;
      case EditingType.DELETE_POINT:
        this.#pointsModel.remove(updateType, update);
        break;
    }
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSort: true});
        this.#renderTrip();
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
    }
  };
}
