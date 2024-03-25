import TripPresenter from './presenter/trip-presenter.js';
import { RenderPosition, render } from './render.js';
import FilterFormView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import PointModel from './model/point-model.js';

const tripInfoView = new TripInfoView ();
const tripControls = document.querySelector('.trip-main__trip-controls');

const filterFormView = new FilterFormView();
const filterFormContainer = document.querySelector('.trip-controls__filters');
const tripInfoContainer = document.querySelector('.trip-events');

const pointModel = new PointModel();
render(tripInfoView, tripControls, RenderPosition.BEFOREBEGIN);
render(filterFormView, filterFormContainer);

const tripPresenter = new TripPresenter({
  container: tripInfoContainer,
  pointModel
});
tripPresenter.init();

