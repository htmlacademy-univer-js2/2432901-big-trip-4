import { PointMode, UpdateType, EditingType } from '../const';
import { remove, render, replace } from '../framework/render';
import { isBigDifference, isEscapeButton } from '../utils';
import PointEditView from '../view/point-edit-view';
import PointView from '../view/point-view';

export default class PointPresenter {
  #container = null;
  #point = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleModeChange = null;
  #mode = PointMode.DEFAULT;

  constructor({ container, destinationsModel, offersModel, onDataChange, onModeChange }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    const previousPointComponent = this.#pointComponent;
    const previousPointEditComponent = this.#pointEditComponent;
    this.#point = point;
    this.#pointComponent = new PointView({
      point: point,
      destinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.getByType(point.type),
      onEditPointClick: this.#handlePointEditClick,
      onFavoritePointClick: this.#handleFavoritePointClick
    });

    this.#pointEditComponent = new PointEditView({
      point: point,
      destinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onRollUpPointClick: this.#handleFormRollUpClick,
      onFormSubmit: this.#handleFormSubmit,
      onCancelFormClick: this.#handleCancelClick
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

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  reset() {
    if (this.#mode !== PointMode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
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
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isActive: true,
        isSaving: false,
        isDeleting: false
      });
    };
    this.#pointEditComponent.shake(resetFormState);
  }

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#handleEscKeyDown);
    this.#handleModeChange();
    this.#mode = PointMode.EDIT;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#mode = PointMode.DEFAULT;
  };

  #handleEscKeyDown = (event) => {
    if (isEscapeButton(event)) {
      event.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handlePointEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormRollUpClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (updatePoint) => {
    const isMinor = isBigDifference(updatePoint, this.#point);
    if (isMinor) {
      this.#handleDataChange(
        EditingType.UPDATE_POINT,
        isMinor ? UpdateType.MINOR : UpdateType.PATCH,
        updatePoint
      );
    }
    if (this.#pointEditComponent.isActive) {
      this.#replaceFormToPoint();
    }
  };

  #handleCancelClick = (event) => {
    this.#handleDataChange(
      EditingType.DELETE_POINT,
      UpdateType.MINOR,
      event
    );
  };

  #handleFavoritePointClick = () => {
    this.#handleDataChange(
      EditingType.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
  };
}
