import BoardPresenter from './presenter/board-presenter';
import { render, RenderPosition } from './render';
import FilterView from './view/filter-view';
import TripInfoView from './view/trip-info-view';

const bodyElement = document.querySelector('body');
const filterElement = bodyElement.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main');
const boardContainer = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({container: boardContainer});

boardPresenter.init();

render(new FilterView(), filterElement);
render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
