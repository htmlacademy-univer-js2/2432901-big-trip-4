import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filters-model.js';
import PointCreationStateModel from './model/point-creation-state-model.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic kbwrhbjw4hjw34bhj34';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const headerTripContainer = document.querySelector('.trip-main');
const filterContainer = headerTripContainer.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');

const destinationsModel = new DestinationsModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const pointsModel = new PointsModel(pointsApiService, destinationsModel, offersModel);

const filterModel = new FilterModel();
const pointCreationStateModel = new PointCreationStateModel();

const tripInfoPresenter = new TripInfoPresenter({
  container: headerTripContainer,
  pointsModel,
  destinationsModel,
  offersModel,
});
const filterPresenter = new FilterPresenter({
  container: filterContainer,
  filterModel,
  pointsModel,
});
const newPointButtonPresenter = new NewPointButtonPresenter({
  container: headerTripContainer,
  pointsModel,
  pointCreationStateModel,
});
const tripPresenter = new TripPresenter({
  container: tripContainer,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  pointCreationStateModel,
});

tripInfoPresenter.init();
filterPresenter.init();
newPointButtonPresenter.init();
tripPresenter.init();

pointsModel.init();
