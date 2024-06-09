import { remove, render, RenderPosition } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import { EditingType, UpdateType, EditType } from '../const.js';
import { isEscapeKey } from '../utils/common.js';

export default class NewPointPresenter {
  #eventListContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({eventListContainer, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#eventListContainer = eventListContainer;
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
      eventDestination: this.#destinationsModel.get(),
      eventOffers: this.#offersModel.get(),
      onEditSubmit: this.#handleEditSubmit,
      onEditReset: this.#handleResetClick,
      eventType: EditType.CREATING
    });

    render(this.#pointEditComponent, this.#eventListContainer.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleEditSubmit = (event) => {
    this.#handleDataChange(
      EditingType.ADD_POINT,
      UpdateType.MINOR,
      event,
    );
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
