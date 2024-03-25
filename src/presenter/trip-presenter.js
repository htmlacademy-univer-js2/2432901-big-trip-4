import EventsListView from '../view/event-list-view.js';
import CurrentFormView from '../view/point-edit-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  sortFormView = new SortView();
  eventsListView = new EventsListView();

  constructor ({container, pointModel}) {
    this.container = container;
    this.pointModel = pointModel;
  }

  init() {
    this.tripPoint = [...this.pointModel.getPoints()];
    this.currentPoint = this.pointModel.getPoint();

    render(this.sortFormView, this.container);
    render(this.eventsListView, this.container);

    render(new CurrentFormView({point: this.currentPoint}), this.eventsListView.getElement());

    for (let i = 0; i < this.tripPoint.length; i++) {
      render(new PointView({data: this.tripPoint[i]}), this.eventsListView.getElement());
    }
  }
}
