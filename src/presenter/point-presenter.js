import { render, replace, remove } from '../framework/render.js';
import { isEscapeButton } from '../utils/common.js';
import EventView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { EditingType, UpdateType, Mode } from '../const.js';
import { isBigDifference } from '../utils/event.js';

export default class EventPresenter {
  #pointListContainer = null;
  #destinationsModel = null;
  #offersModel = null;

  #point = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({eventListContainer, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#pointListContainer = eventListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(event) {
    this.#point = event;

    const prevEventComponent = this.#pointComponent;
    const prevEventEditComponent = this.#pointEditComponent;

    this.#pointComponent = new EventView({
      event: this.#point,
      eventDestination: this.#destinationsModel.getById(event.destination),
      eventOffers: this.#offersModel.getByType(event.type),
      onRollupClick: this.#pointRollupClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#pointEditComponent = new PointEditView({
      event: this.#point,
      eventDestination: this.#destinationsModel.get(),
      eventOffers: this.#offersModel.get(),
      onEditSubmit: this.#editSubmitHandler,
      onEditReset: this.#editResetHandler,
      onRollupClick: this.#editorRollupClickHandler,
    });


    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEventEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditorToEvent();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
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

  #replaceEventToEditor() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditorToEvent() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #favoriteClickHandler = () => {
    this.#handleDataChange(
      EditingType.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #pointRollupClickHandler = () => {
    this.#replaceEventToEditor();
  };

  #editorRollupClickHandler = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditorToEvent();
  };

  #editSubmitHandler = (update) => {
    const isMinorUpdate = isBigDifference(update, this.#point);
    this.#handleDataChange(
      EditingType.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  };

  #editResetHandler = (event) => {
    this.#handleDataChange(
      EditingType.DELETE_POINT,
      UpdateType.MINOR,
      event,
    );
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeButton(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditorToEvent();
    }
  };
}
