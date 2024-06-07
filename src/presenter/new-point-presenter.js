import { RenderPosition, remove, render } from '../framework/render';
import { UpdateType, EditingType } from '../const';
import { isEscapeButton } from '../utils';
import PointEditView from '../view/point-edit-view';
export default class NewPointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointEditComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;

  constructor({ container, destinationsModel, offersModel, onDataChange, onDestroy }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      isCreating: true,
      onRollUpPointClick: this.#handleCancelClick,
      onFormSubmit: this.#handleFormSubmit,
      onCancelFormClick: this.#handleCancelClick
    });
    render(this.#pointEditComponent, this.#container.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#handleEscKeyDown);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#handleDestroy();
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

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      EditingType.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #handleEscKeyDown = (event) => {
    if (isEscapeButton(event)) {
      event.preventDefault();
      this.destroy();
    }
  };
}
