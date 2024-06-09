import TripPresenter from './presenter/trip-presenter.js';
import PointsApiService from './points-api-service.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import { RenderPosition, render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import DestinationsModel from './model/destinations-model.js';
import FiltersModel from './model/filters-model.js';
import NewPointView from './view/new-point-view.js';

const AUTHORIZATION = 'Basic vsdegbjdfe3';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const mainElement = document.querySelector('.page-main');
const tripInfoElement = document.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const eventListElement = mainElement.querySelector('.trip-events');

const apiService = new PointsApiService(END_POINT, AUTHORIZATION);
const destinationsModel = new DestinationsModel(apiService);
const filtersModel = new FiltersModel();
const offersModel = new OffersModel(apiService);
const pointsModel = new PointsModel({apiService, destinationsModel, offersModel});

const tripPresenter = new TripPresenter({
  container: eventListElement,
  tripInfoContainer: tripInfoElement,
  offersModel,
  pointsModel,
  destinationsModel,
  filtersModel,
  onNewPointDestroy: handleNewPointFormCancel,
});

const filterPresenter = new FilterPresenter({container: filterElement, pointsModel, filtersModel});

const newPointComponent = new NewPointView({
  onClick: handleNewPointClick
});

function handleNewPointFormCancel() {
  newPointComponent.element.disabled = false;
}

function handleNewPointClick() {
  tripPresenter.createPoint();
  newPointComponent.element.disabled = true;
}

render(newPointComponent, tripInfoElement, RenderPosition.BEFOREEND);

filterPresenter.init();
tripPresenter.init();
pointsModel.init();


