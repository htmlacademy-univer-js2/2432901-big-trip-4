import { UpdateType } from '../const';
import { render } from '../framework/render';
import NewPointButtonView from '../view/new-point-button-view';

export default class NewPointButtonPresenter {
  #container = null;
  #pointsModel = null;
  #pointCreationStateModel = null;
  #button = null;

  constructor({ container, pointsModel, pointCreationStateModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#pointCreationStateModel = pointCreationStateModel;
  }

  init() {
    this.#button = new NewPointButtonView({ onClick: this.#buttonClickHandler });
    this.#button.disabled = true;
    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#pointCreationStateModel.addObserver(this.#pointCreationStateChangeHandler);
    render(this.#button, this.#container);
  }

  #buttonClickHandler = () => {
    this.#pointCreationStateModel.isCreating = true;
  };

  #pointCreationStateChangeHandler = (isCreating) => {
    this.#button.disabled = isCreating;
  };

  #modelEventHandler = (type, data) => {
    if (type === UpdateType.INIT) {
      this.#button.disabled = data.isError;
    }
  };
}
