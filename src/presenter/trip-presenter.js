import EventsListView from '../view/event-list-view.js';
import CurrentFormView from '../view/point-edit-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import OpenFormBtnView from '../view/open-form-button-view.js';
import { RenderPosition, render, replace } from '../framework/render.js';
import CloseFormBtnView from '../view/close-form-button-view.js';
import SaveFormBtnView from '../view/save-form-button-view.js';

export default class TripPresenter {
  #sortFormView = new SortView();
  #pointsListView = new EventsListView();
  #container = null;
  #pointModel = null;
  #formComponent = null;
  #boardPoint = [];

  constructor ({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoint = [...this.#pointModel.getPoints()];

    render(this.#sortFormView, this.#container);
    render(this.#pointsListView, this.#container);

    for (let i = 0; i < this.#boardPoint.length; i++) {
      this.#renderPoint(this.#boardPoint[i]);
    }
  }

  #renderPoint (point) {
    const escKeyDownBtnHandler = (evt) => {
      if (evt.key === 'Escape') {
        replacePointToForm();
        document.removeEventListener('keydown', escKeyDownBtnHandler);
      }
    };
    const pointComponent = new PointView({data: point});
    const formComponent = new CurrentFormView({
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

    render(pointComponent, this.#pointsListView.element);
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
