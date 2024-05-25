import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import MockService from './service/mock-service.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import { RenderPosition, render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import DestinationsModel from './model/destinations-model.js';
import FiltersModel from './model/filters-model.js';
import NewPointView from './view/new-point-view.js';

const tripInfoElement = document.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const mockService = new MockService();
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const destinationsModel = new DestinationsModel(mockService);
const filtersModel = new FiltersModel();

const tripPresenter = new TripPresenter({
  container: eventListElement,
  offersModel,
  pointsModel,
  destinationsModel,
  filtersModel,
  onNewPointDestroy: newPointFormCloseHandler
});

const filterPresenter = new FilterPresenter({container: filterElement, pointsModel, filtersModel});

const newPointComponent = new NewPointView({
  onClick: newPointClickHandler
});

function newPointFormCloseHandler() {
  newPointComponent.element.disabled = false;
}

function newPointClickHandler() {
  tripPresenter.createPoint();
  newPointComponent.element.disabled = true;
}

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(newPointComponent, tripInfoElement, RenderPosition.BEFOREEND);

tripPresenter.init();
filterPresenter.init();
