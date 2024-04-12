import EventListView from '../view/event-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import FilterFormView from '../view/filter-form-view.js';
import FilterItemView from '../view/filter-item-view.js';
import OpenFormBtnView from '../view/open-form-button-view.js';
import CloseFormBtnView from '../view/close-form-button-view.js';
import SaveFormBtnView from '../view/save-form-button-view.js';
import TripInfoView from '../view/trip-info-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import { RenderPosition, render, replace } from '../framework/render.js';
import { generateFilter } from '../mock/filters.js';

export default class TripPresenter {
  #eventListView = new EventListView();
  #emptyPointListView = new EmptyPointListView();
  #tripInfoView = new TripInfoView();
  #filterFormView = new FilterFormView();
  #sortView = new SortView();
  #container = null;
  #pointModel = null;
  #tripPoint = [];

  constructor ({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    this.#tripPoint = [...this.#pointModel.getPoints()];
    const tripControls = document.querySelector('.trip-main__trip-controls');
    const filterFormContainer = document.querySelector('.trip-controls__filters');
    const filters = generateFilter(this.#tripPoint);
    render(this.#filterFormView, filterFormContainer);
    for (let i = 0; i < filters.length; i++) {
      render(new FilterItemView(filters[i]), this.#filterFormView.element);
    }

    if (this.#tripPoint.length > 0) {
      render(this.#tripInfoView, tripControls, RenderPosition.BEFOREBEGIN);
      render(this.#sortView, this.#container);
      render(this.#eventListView, this.#container);
      for (let i = 0; i < this.#tripPoint.length; i++) {
        this.#renderPoint(this.#tripPoint[i]);
      }
    }
    else {
      render(this.#emptyPointListView, this.#container);
    }
  }

  #renderPoint (point) {
    const pointComponent = new PointView({data: point});
    const escKeyDownBtnHandler = (evt) => {
      if (evt.key === 'Escape') {
        replacePointToForm();
        document.removeEventListener('keydown', escKeyDownBtnHandler);
      }
    };
    const formComponent = new PointEditView({
      data: point,
      onSubmit: () => {
        replacePointToForm();
        document.removeEventListener('keydown', escKeyDownBtnHandler);
      }});
    const deleteBtn = formComponent.element.querySelector('.event__reset-btn');
    const openBtn = new OpenFormBtnView({
      onClick: () => {
        replaceFormToPoint();
        document.addEventListener('keydown', escKeyDownBtnHandler);
      }});
    const closeBtn = new CloseFormBtnView({
      onClick: () => {
        replacePointToForm();
        document.removeEventListener('keydown', escKeyDownBtnHandler);
      }});
    const saveBtn = new SaveFormBtnView();

    render(pointComponent, this.#eventListView.element);
    render(openBtn, pointComponent.element, RenderPosition.BEFOREEND);
    render(saveBtn, deleteBtn, RenderPosition.BEFOREBEGIN);
    render(closeBtn, deleteBtn, RenderPosition.AFTEREND);

    function replacePointToForm() {
      replace(pointComponent, formComponent);
    }

    function replaceFormToPoint() {
      replace(formComponent, pointComponent);
    }
  }
}
