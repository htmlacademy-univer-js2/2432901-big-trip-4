import { createFilterFormTemplate } from '../templates/filter-form-template.js';
import AbstractView from '../framework/view/abstract-view.js';

export default class FilterFormView extends AbstractView{
  get template() {
    return createFilterFormTemplate();
  }
}
