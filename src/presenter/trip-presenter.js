import { render, RenderPosition, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripEventsView from '../view/trip-events-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
import MessageView from '../view/empty-point-list-view.js';
import { SortType, EditingType, UpdateType, FilterType, TimeLimit } from '../const.js';
import { sort } from '../utils/sort.js';
import { filter } from '../utils/filter.js';

export default class TripPresenter {
  #eventListComponent = new TripEventsView();
  #sortComponent = null;
  #emptyPointComponent = null;

  #tripInfoContainer = null;
  #tripEventsContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filtersModel = null;
  #handleNewEventClick = null;
  #handleNewEventDestroy = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #tripInfoPresenter = null;
  #filterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;
  #isLoading = true;
  #isLoadingError = false;
  #isCreating = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({tripInfoContainer, tripEventsContainer, destinationsModel, offersModel, pointsModel, filtersModel, onNewPointDestroy, onNewEventClick}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#handleNewEventClick = onNewEventClick;
    this.#handleNewEventDestroy = onNewPointDestroy;

    this.#newPointPresenter = new NewPointPresenter({
      eventListContainer: this.#eventListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#filterType = this.#filtersModel.filter;
    const events = this.#pointsModel.get();
    const filteredEvents = filter[this.#filterType](events);

    return sort[this.#currentSortType](filteredEvents);
  }

  get eventsEverything() {
    this.#filterType = FilterType.EVERYTHING;
    const events = this.#pointsModel.get();
    const filteredEvents = filter[this.#filterType](events);

    return sort[this.#currentSortType](filteredEvents);
  }

  init() {
    this.#renderTrip();
  }

  createEvent() {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
    this.#isCreating = false;
  }

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderMessage({isLoading: true});
      this.#handleNewEventClick();
      return;
    }

    if (this.#isLoadingError) {
      this.#renderMessage({isLoadingError: true});
      this.#handleNewEventClick();
      return;
    }

    if (this.events.length === 0 && !this.#isCreating) {
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    this.#renderEventContainer();
    this.#renderEvents();
  }

  #renderEventContainer() {
    render(this.#eventListComponent, this.#tripEventsContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderMessage({isLoading = false, isLoadingError = false} = {}) {
    this.#emptyPointComponent = new MessageView({
      filterType: this.#filterType,
      isLoading,
      isLoadingError,
    });

    render(this.#emptyPointComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderTripInfo = () => {
    this.#tripInfoPresenter = new TripInfoPresenter({
      tripInfoContainer: this.#tripInfoContainer,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    const sortedEvents = sort[SortType.DAY](this.eventsEverything);
    this.#tripInfoPresenter.init(sortedEvents);
  };

  #renderEvents() {
    this.events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new PointPresenter({
      eventListContainer: this.#eventListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    eventPresenter.init(event);
    this.#pointPresenters.set(event.id, eventPresenter);
  }

  #clearTripInfo = () => {
    this.#tripInfoPresenter.destroy();
  };

  #clearTrip({ resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    if (this.#emptyPointComponent) {
      remove(this.#emptyPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case EditingType.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case EditingType.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addEvent(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case EditingType.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.remove(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        this.#clearTripInfo();
        this.#renderTripInfo();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoadingError = data.isError;
        this.#isLoading = false;
        this.#handleNewEventDestroy();
        this.#clearTrip();
        this.#renderTrip();
        this.#renderTripInfo();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
