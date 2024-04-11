import AbstractView from '../framework/view/abstract-view';

function createSaveFormBtn() {
  return '<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>';
}

export default class SaveFormBtnView extends AbstractView{
  get template() {
    return createSaveFormBtn();
  }
}
