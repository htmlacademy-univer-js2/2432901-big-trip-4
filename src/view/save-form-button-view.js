import AbstractView from '../framework/view/abstract-view';
import { createSaveFormBtn } from '../templates/save-form-button-template';

export default class SaveFormBtnView extends AbstractView{
  get template() {
    return createSaveFormBtn();
  }
}
