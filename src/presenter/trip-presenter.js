import SortView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import { RenderPosition, remove, render } from '../framework/render';
import EmptyPointListView from '../view/empty-point-list-view';
import PointPresenter from './point-presenter';
import { sortByDay, sortByPrice, sortByTime } from '../utils';
import { ACTIVE_SORT_TYPES, FilterOptions, FilterTypes, SortTypes, UpdateType, EditingType, TimeLimit } from '../const';
import NewPointPresenter from './new-point-presenter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';


export default class TripPresenter {
  #container = null;

  #points = [];

  #offersModel = null;
  #pointsModel = null;
  #destinationsModel = null;
  #filtersModel = null;

  #pointPresenter = new Map();
  #newPointPresenter = null;

  #sortComponent = null;
  #emptyListComponent = null;
  #eventListComponent = new EventListView();

  #currentSortType = SortTypes.DAY;
  #filterType = FilterTypes.EVERYTHING;

  #isLoading = true;
  #isLoadingError = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
    if (this.#isLoading) {
      this.#renderEmptyListView({isLoading: true});
      return;
    }

    if (this.#isLoadingError) {
      this.#renderEmptyListView({isLoadingError: true});
      return;
    }

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
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderEmptyListView = ({isLoading = false, isLoadingError = false} = {}) => {
    this.#emptyListComponent = new EmptyPointListView({
      filterType: this.#filterType,
      isLoading,
      isLoadingError
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
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    remove(this.#emptyListComponent);

    if (resetSort) {
      this.#currentSortType = SortTypes.DAY;
    }
  };

  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((pointPresenter) => pointPresenter.reset());
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #actionViewChangeHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case EditingType.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.update(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case EditingType.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case EditingType.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.remove(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSort: true});
        this.#renderTrip();
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        if (data.isError) {
          this.#isLoadingError = data.isError;
        }
        this.#isLoading = false;
        this.#clearTrip();
        this.#renderTrip();
        break;
    }
  };
}
