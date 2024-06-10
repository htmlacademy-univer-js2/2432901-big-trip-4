import { SortTypes } from '../const';
import { render, replace, remove, RenderPosition } from '../framework/render';
import { sort } from '../utils/sort';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #container = null;

  #destinationsModel = null;
  #pointsModel = null;
  #offersModel = null;

  #tripInfoView = null;

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel.addObserver(this.#pointsModelEventHandler);
  }

  init() {
    const points = this.#pointsModel.get();
    if (points.length === 0) {
      remove(this.#tripInfoView);
      this.#tripInfoView = null;
      return;
    }
    const prevTripInfoView = this.#tripInfoView;
    this.#tripInfoView = new TripInfoView(this.#createPointsInfo(points));
    if (prevTripInfoView === null) {
      render(this.#tripInfoView, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#tripInfoView, prevTripInfoView);
    remove(prevTripInfoView);
  }

  #createPointsInfo(points) {
    const sortedPoints = sort[SortTypes.DAY](points);
    const shortHeader = sortedPoints.length > 3;
    return {
      short: shortHeader,
      destinations: (shortHeader ? [sortedPoints[0], sortedPoints[sortedPoints.length - 1]] : sortedPoints)
        .map((point) => this.#destinationsModel.getById(point.destination).name),
      dateFrom: sortedPoints[0].dateFrom,
      dateTo: sortedPoints[sortedPoints.length - 1].dateTo,
      totalCost: sortedPoints.reduce(
        (totalCost, point) => totalCost + point.basePrice + point.offers.reduce(
          (totalOffersCost, offerId) => totalOffersCost + this.#offersModel.getByTypeAndId(point.type, offerId).price, 0), 0)
    };
  }

  #pointsModelEventHandler = () => {
    this.init();
  };
}
