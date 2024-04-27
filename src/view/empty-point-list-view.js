import AbstractView from '../framework/view/abstract-view';
import { createEmptyPointsListTemplate } from '../templates/empty-point-list-template';


export default class EmptyPointListView extends AbstractView{

  get template() {
    return createEmptyPointsListTemplate();
  }
}
