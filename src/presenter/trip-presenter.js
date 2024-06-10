import { remove, render, replace } from '../framework/render.js';
import { ENABLED_SORT_TYPES, FilterType, SortTypes, UpdateType, UserAction, TimeLimit, PointMode } from '../const.js';
import { sort } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/event-list-view.js';
import MessageView from '../view/message-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class TripPresenter {
  #container = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #pointCreationStateModel = null;

  #sortView = null;
  #eventsListView = new EventsListView();
  #messageView = null;

  #currentSortType = SortTypes.DAY;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #openedEditPointId = null;
  #isLoading = true;
  #isLoadingError = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ container, destinationsModel, offersModel, pointsModel, filterModel, pointCreationStateModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointCreationStateModel = pointCreationStateModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventsListView.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#pointCreationStateModel.addObserver(this.#pointCreationStateChangeHandler);
  }

  init() {
    this.#renderTrip();
  }

  get points() {
    const filterType = this.#filterModel.get();
    const filteredPoints = filter[filterType](this.#pointsModel.get());
    return sort[this.#currentSortType](filteredPoints);
  }

  #renderTrip() {
    if (this.#isLoading || this.#isLoadingError) {
      this.#renderLoadingMessage();
      return;
    }

    const points = this.points;
    if (points.length === 0 && !this.#pointCreationStateModel.isCreating) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints(points);
  }

  #renderSort() {
    const prevSortView = this.#sortView;
    const sortTypes = Object.values(SortTypes).map((type) => ({
      type: type,
      enabled: ~ENABLED_SORT_TYPES.indexOf(type),
    }));
    this.#sortView = new SortView({
      types: sortTypes,
      selected: this.#currentSortType,
      onTypeChanged: this.#sortTypeChangeHandler
    });
    if (prevSortView) {
      replace(this.#sortView, prevSortView);
      remove(prevSortView);
    } else {
      render(this.#sortView, this.#container);
    }
  }

  #renderLoadingMessage() {
    this.#messageView = new MessageView({ isLoading: this.#isLoading, isLoadingError: this.#isLoadingError });
    render(this.#messageView, this.#container);
  }

  #renderEmptyList() {
    this.#messageView = new MessageView({ filter: this.#filterModel.get() });
    render(this.#messageView, this.#container);
  }

  #renderPointsList() {
    render(this.#eventsListView, this.#container);
  }

  #renderPoints(points) {
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i]);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#eventsListView.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #modeChangeHandler = (id, mode) => {
    if (mode === PointMode.DEFAULT) {
      this.#openedEditPointId = null;
    } else {
      if (this.#openedEditPointId !== null) {
        this.#pointPresenters.get(this.#openedEditPointId).resetView();
      }
      this.#openedEditPointId = id;
      this.#newPointPresenter.destroy();
    }
  };

  #clearTrip() {
    this.#clearPoints();
    remove(this.#sortView);
    remove(this.#messageView);
    this.#sortView = null;
    this.#messageView = null;
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
    this.#openedEditPointId = null;
  }

  #sortTypeChangeHandler = (type) => {
    this.#currentSortType = type;
    this.#clearTrip();
    this.#renderTrip();
  };

  #pointCreationStateChangeHandler = (isCreating) => {
    if (isCreating === this.#newPointPresenter.initialized) {
      return;
    }
    if (isCreating) {
      this.#currentSortType = SortTypes.DAY;
      this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
      this.#newPointPresenter.init();
    } else {
      this.#newPointPresenter.destroy();
    }
  };

  #newPointDestroyHandler = () => {
    this.#pointCreationStateModel.isCreating = false;
    if (this.#pointsModel.get().length === 0) {
      this.#modelEventHandler(UpdateType.MINOR);
    }
  };

  #viewActionHandler = async (actionType, updateType, point) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, point);
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(point.id).setSaving();
        try {
          await this.#pointsModel.update(updateType, point);
        } catch {
          this.#pointPresenters.get(point.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(point.id).setDeleting();
        try {
          await this.#pointsModel.remove(updateType, point);
        } catch {
          this.#pointPresenters.get(point.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#currentSortType = SortTypes.DAY;
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isLoadingError = data.isError;
        this.#clearTrip();
        this.#renderTrip();
        break;
      default:
        break;
    }
  };
}
