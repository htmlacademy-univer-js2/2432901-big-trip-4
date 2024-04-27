import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import OpenFormBtnView from '../view/open-form-button-view.js';
import CloseFormBtnView from '../view/close-form-button-view.js';
import SaveFormBtnView from '../view/save-form-button-view.js';
import { RenderPosition, remove, render, replace } from '../framework/render.js';
import { Mode } from '../const.js';

export default class PointPresenter {
  #pointsListView;

  #handlePointChange;
  #handleModeChange;

  #point;
  #mode = Mode.DEFAULT;

  #pointComponent;
  #pointEditComponent;

  constructor ({pointListContainer, onDataChange, onModeChange}) {
    this.#pointsListView = pointListContainer;
    this.#handlePointChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#pointEditComponent;

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        this.#replacePointToEditForm();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    this.#pointComponent = new PointView({
      data: this.#point,
      onFavouriteClick: this.#onFavouriteClick,
    });

    this.#pointEditComponent = new PointEditView({
      data: this.#point,
      onSubmit: () => {
        this.#replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    const deleteBtn = this.#pointEditComponent.element.querySelector('.event__reset-btn');

    const openBtn = new OpenFormBtnView({
      onClick: () => {
        this.#replacePointToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }});

    const closeBtn = new CloseFormBtnView({
      onClick: () => {
        this.#replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }});

    const saveBtn = new SaveFormBtnView();

    render(openBtn, this.#pointComponent.element, RenderPosition.BEFOREEND);
    render(saveBtn, deleteBtn, RenderPosition.BEFOREBEGIN);
    render(closeBtn, deleteBtn, RenderPosition.AFTEREND);

    if (!prevPointComponent || !prevEditFormComponent) {
      render(this.#pointComponent, this.#pointsListView);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevEditFormComponent);
    }

    remove(prevEditFormComponent);
    remove(prevPointComponent);
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#replaceEditFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToEditForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #onFavouriteClick = () => {
    this.#handlePointChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

}
