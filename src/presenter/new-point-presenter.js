import { UpdateType, EditingType } from '../const';
import { isEscapeButton } from '../utils';
import { RenderPosition, remove, render } from '../framework/render';
import PointEditView from '../view/point-edit-view';

export default class NewPointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointEditComponent = null;
  #onDataChange = null;
  #onDestroy = null;

  constructor({ container, destinationsModel, offersModel, onDataChange, onDestroy }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      isCreating: true,
      onRollUpPointClick: this.#cancelClickHandler,
      onSubmitForm: this.#formSubmitHandler,
      onCancelFormClick: this.#cancelClickHandler
    });
    render(this.#pointEditComponent, this.#container.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#onDestroy();
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isActive: false,
      isSaving: true
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

  #formSubmitHandler = (point) => {
    this.#onDataChange(
      EditingType.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #cancelClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (event) => {
    if (isEscapeButton(event)) {
      event.preventDefault();
      this.destroy();
    }
  };
}
