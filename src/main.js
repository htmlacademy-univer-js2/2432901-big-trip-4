import TripPresenter from './presenter/trip-presenter.js';
import PointsApiService from './points-api-service.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import { RenderPosition, render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import DestinationsModel from './model/destinations-model.js';
import FiltersModel from './model/filters-model.js';
import NewPointView from './view/new-point-view.js';

const AUTHORIZATION = 'Basic nbchrfbh6';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const tripMainContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const apiService = new PointsApiService(END_POINT, AUTHORIZATION);

const filtersModel = new FiltersModel();
const destinationsModel = new DestinationsModel(apiService);
const offersModel = new OffersModel(apiService);
const pointsModel = new PointsModel({
  apiService,
  destinationsModel,
  offersModel
});

const newPointComponent = new NewPointView({
  onClick: handleNewEventButtonClick
});

function handleNewEventClick() {
  newPointComponent.element.disabled = true;
}

const tripPresenter = new TripPresenter({
  tripInfoContainer: tripMainContainer,
  tripEventsContainer,
  destinationsModel,
  offersModel,
  pointsModel,
  filtersModel,
  onNewPointDestroy: handleNewPointFormCancel,
  onNewEventClick: handleNewEventClick,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filtersModel,
  pointsModel
});

function handleNewPointFormCancel() {
  newPointComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  tripPresenter.createEvent();
  handleNewEventClick();
}

render(newPointComponent, tripMainContainer, RenderPosition.BEFOREEND);
filterPresenter.init();
tripPresenter.init();
pointsModel.init();
