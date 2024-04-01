import AbstractView from '../framework/view/abstract-view.js';
import { createPointEditTemplate } from '../templates/point-edit-template.js';

export default class PointEditView extends AbstractView{
  #pointForm = null;
  #handleSubmit = null;

  constructor ({data, onSubmit}) {
    super();
    this.#pointForm = data;
    this.#handleSubmit = onSubmit;
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
  }

  get template() {
    return createPointEditTemplate(this.#pointForm);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit();
  };
}
