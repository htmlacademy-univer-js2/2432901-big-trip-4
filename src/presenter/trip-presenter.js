import { RenderPosition, remove, render } from '../framework/render';
import { ACTIVE_SORT_TYPES, FilterTypes, SortTypes, TimeLimit, UpdateType, EditingType } from '../const';
import { FilterOptions, SortingOptions } from '../utils';
import SortView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import EmptyPointListView from '../view/empty-point-list-view';
import PointPresenter from './point-presenter';
import TripInfoPresenter from './trip-info-presenter';
import NewPointPresenter from './new-point-presenter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';


export default class TripPresenter {
  #container = null;
  #tripInfoContainer = null;

  #points = [];

  #offersModel = null;
  #pointsModel = null;
  #destinationsModel = null;
  #filtersModel = null;

  #pointPresenter = new Map();
  #newPointPresenter = null;
  #tripInfoPresenter = null;

  #sortComponent = null;
  #emptyPointListComponent = null;
  #eventListComponent = new EventListView();

  #currentSortType = SortTypes.DAY;
  #filterType = FilterTypes.EVERYTHING;

  #isLoading = true;
  #isLoadingError = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({container, tripInfoContainer, offersModel, pointsModel, destinationsModel, filtersModel, onNewPointDestroy}) {
    this.#container = container;
    this.#tripInfoContainer = tripInfoContainer;

    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#filtersModel = filtersModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleActionViewChange,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = FilterOptions[this.#filterType](points);

    return SortingOptions[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderEmptyPointListView({isLoading: true});
      return;
    }

    if (this.#isLoadingError) {
      this.#renderEmptyPointListView({isLoadingError: true});
      return;
    }

    if (this.points.length === 0) {
      this.#renderEmptyPointListView();
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#container);
    this.#renderPoints();
  }

  #renderTripInfo = () => {
    this.#tripInfoPresenter = new TripInfoPresenter({
      container: this.#tripInfoContainer,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    const sortedPoints = SortingOptions[SortTypes.DAY](this.points);
    this.#tripInfoPresenter.init(sortedPoints);
  };

  #clearTripInfo = () => {
    this.#tripInfoPresenter.destroy();
  };

  #renderSort = () => {
    const sortTypes = Object.values(SortTypes).map((sortType) => ({
      type: sortType,
      active: ACTIVE_SORT_TYPES.indexOf(sortType)
    }));


    this.#sortComponent = new SortView({
      sortTypes: sortTypes,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    this.#clearTripInfo();
    this.#renderTripInfo();

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
      onDataChange: this.#handleActionViewChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderEmptyPointListView = ({isLoading = false, isLoadingError = false} = {}) => {
    this.#emptyPointListComponent = new EmptyPointListView({
      filterType: this.#filterType,
      isLoading,
      isLoadingError
    });

    render(this.#emptyPointListComponent, this.#container, RenderPosition.AFTERBEGIN);
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

    remove(this.#emptyPointListComponent);

    if (resetSort) {
      this.#currentSortType = SortTypes.DAY;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((pointPresenter) => pointPresenter.reset());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #handleActionViewChange = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case EditingType.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.update(updateType, update);
        }
        catch (error) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case EditingType.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
        }
        catch (error) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case EditingType.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.remove(updateType, update);
        }
        catch (error) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSort: true});
        this.#renderTrip();
        break;
      case UpdateType.MINOR:
        this.#clearTripInfo();
        this.#renderTripInfo();
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoadingError = data.isError;
        this.#isLoading = false;
        this.#renderTripInfo();
        this.#clearTrip();
        this.#renderTrip();
        break;
    }
  };
}
