import { UpdateType, UserAction, PointMode } from '../const';
import { remove, render, replace } from '../framework/render';
import { isEscapeButton } from '../utils/common';
import { isBigDifference } from '../utils/point';
import PointEditView from '../view/point-edit-view';
import PointView from '../view/point-view';

export default class PointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #point = null;
  #pointDefaultView = null;
  #pointEditView = null;
  #mode = PointMode.DEFAULT;

  constructor({ container, destinationsModel, offersModel, onDataChange, onModeChange }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    const prevPointDefaultView = this.#pointDefaultView;
    const prevPointEditView = this.#pointEditView;
    this.#point = point;
    this.#pointDefaultView = new PointView({
      point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: this.#editClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });
    this.#pointEditView = new PointEditView({
      point,
      destinations: this.#destinationsModel.get(),
      offers: this.#offersModel.get(),
      onFormSubmit: this.#formSubmitHandler,
      onFormReset: this.#deleteClickHandler,
      onFormCancel: this.#formCancelHandler,
    });

    if (prevPointDefaultView === null || prevPointEditView === null) {
      render(this.#pointDefaultView, this.#container);
      return;
    }

    if (this.#mode === PointMode.DEFAULT) {
      replace(this.#pointDefaultView, prevPointDefaultView);
    } else {
      replace(this.#pointEditView, prevPointEditView);
    }

    remove(prevPointDefaultView);
    remove(prevPointEditView);
  }

  resetView() {
    if (this.#mode === PointMode.EDIT) {
      this.#pointEditView.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointDefaultView);
    remove(this.#pointEditView);
  }

  setSaving() {
    if (this.#mode === PointMode.DEFAULT) {
      this.#pointDefaultView.lock();
      return;
    }
    this.#pointEditView.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    if (this.#mode === PointMode.DEFAULT) {
      return;
    }
    this.#pointEditView.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditView.shake(resetFormState);
  }


  #replacePointToForm() {
    this.#mode = PointMode.EDIT;
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange(this.#point.id, this.#mode);
    replace(this.#pointEditView, this.#pointDefaultView);
  }

  #replaceFormToPoint() {
    this.#mode = PointMode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange(this.#point.id, this.#mode);
    replace(this.#pointDefaultView, this.#pointEditView);
  }

  #editClickHandler = () => {
    this.#replacePointToForm();
  };

  #favoriteClickHandler = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
  };

  #formSubmitHandler = (updatePoint) => {
    const isMinor = isBigDifference(this.#point, updatePoint);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinor ? UpdateType.MINOR : UpdateType.PATCH,
      updatePoint
    );
  };

  #deleteClickHandler = (updatePoint) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      updatePoint
    );
  };

  #formCancelHandler = () => {
    this.#pointEditView.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeButton(evt)) {
      evt.preventDefault();
      this.#pointEditView.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };
}
