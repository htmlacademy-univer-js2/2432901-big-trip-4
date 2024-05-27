import { PointMode, UpdateType, EditingType } from '../const';
import { remove, render, replace } from '../framework/render';
import { isBigDifference, isEscapeButton } from '../utils';
import PointEditView from '../view/point-edit-view';
import PointView from '../view/point-view';

export default class PointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #onDataChange = null;
  #onModeChange = null;
  #point = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #mode = PointMode.DEFAULT;
  constructor({ container, destinationsModel, offersModel, onDataChange, onModeChange }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    const previousPointComponent = this.#pointComponent;
    const previousPointEditComponent = this.#pointEditComponent;
    this.#point = point;
    this.#pointComponent = new PointView({
      point: point,
      destinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.getByType(point.type),
      onEditPointClick: this.#pointEditClickHandler,
      onFavoritePointClick: this.#favoritePointClickHandler
    });
    this.#pointEditComponent = new PointEditView({
      point: point,
      destinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onRollUpPointClick: this.#formRollUpClickHandler,
      onSubmitForm: this.#formSubmitHandler,
      onCancelFormClick: this.#cancelClickHandler
    });
    if (previousPointComponent === null || previousPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }
    if (this.#mode === PointMode.DEFAULT) {
      replace(this.#pointComponent, previousPointComponent);
    }
    if (this.#mode === PointMode.EDIT) {
      replace(this.#pointComponent, previousPointEditComponent);
      this.#mode = PointMode.DEFAULT;
    }

    remove(previousPointComponent);
    remove(previousPointEditComponent);
  }

  reset() {
    if (this.#mode !== PointMode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  setSaving() {
    if (this.#mode === PointMode.EDIT) {
      this.#pointEditComponent.updateElement({
        isActive: false,
        isSaving: true
      });
    }
  }

  setDeleting() {
    this.#pointEditComponent.updateElement({
      isActive: false,
      isDeleting: true
    });
  }

  setAborting() {
    if (this.#mode === PointMode.EDIT) {
      const resetFormState = () => {
        this.#pointEditComponent.updateElement({
          isActive: true,
          isSaving: false,
          isDeleting: false
        });
      };this.#pointEditComponent.shake(resetFormState);
    } else {
      this.#pointEditComponent.shake();
    }
  }

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = PointMode.EDIT;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PointMode.DEFAULT;
  };

  #escKeyDownHandler = (event) => {
    if (isEscapeButton(event)) {
      event.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #pointEditClickHandler = () => {
    this.#replacePointToForm();
  };

  #formRollUpClickHandler = () => {
    if (!this.#pointEditComponent.isActive) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #formSubmitHandler = (updatePoint) => {
    const isMinor = isBigDifference(updatePoint, this.#point);
    if (isMinor) {
      this.#onDataChange(
        EditingType.UPDATE_POINT,
        isMinor ? UpdateType.MINOR : UpdateType.PATCH,
        updatePoint
      );
    }
    if (this.#pointEditComponent.isActive) {
      this.#replaceFormToPoint();
    }
  };

  #cancelClickHandler = (event) => {
    this.#onDataChange(
      EditingType.DELETE_POINT,
      UpdateType.MINOR,
      event
    );
  };

  #favoritePointClickHandler = () => {
    this.#onDataChange(
      EditingType.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
  };
}
