import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';

const tripInfoContainer = document.querySelector('.trip-events');

const pointModel = new PointModel();

const tripPresenter = new TripPresenter({
  container: tripInfoContainer,
  pointModel
});
tripPresenter.init();

