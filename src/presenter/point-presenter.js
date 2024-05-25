import { PointMode, UpdateType, EditingType } from '../const';
import { remove, render, replace } from '../framework/render';
import { isBigDifference } from '../utils';
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
      replace(this.#pointEditComponent, previousPointEditComponent);
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
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #pointEditClickHandler = () => {
    this.#replacePointToForm();
  };

  #formRollUpClickHandler = () => {
    this.#replaceFormToPoint();
  };

  #formSubmitHandler = (updatePoint) => {
    const isMinor = isBigDifference(updatePoint, this.#point);
    this.#onDataChange(
      EditingType.UPDATE_POINT,
      isMinor ? UpdateType.MINOR : UpdateType.PATCH,
      updatePoint
    );
    this.#replaceFormToPoint();
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
