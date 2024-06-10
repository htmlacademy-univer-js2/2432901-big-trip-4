import ApiService from './framework/api-service';
import { Method, Url } from './const';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: Url.POINTS })
      .then(ApiService.parseResponse)
      .then(PointsApiService.#adaptPointsToClient);
  }

  get offers() {
    return this._load({ url: Url.OFFERS })
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: Url.DESTINATIONS })
      .then(ApiService.parseResponse);
  }

  async addPoint(point) {
    return this._load({
      url: Url.POINTS,
      method: Method.POST,
      body: JSON.stringify(PointsApiService.#adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(ApiService.parseResponse)
      .then(PointsApiService.#adaptPointToClient);
  }

  async updatePoint(point) {
    return this._load({
      url: `${Url.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsApiService.#adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(ApiService.parseResponse)
      .then(PointsApiService.#adaptPointToClient);
  }

  async deletePoint(point) {
    return this._load({
      url: `${Url.POINTS}/${point.id}`,
      method: Method.DELETE,
    });
  }

  static #adaptPointToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom.toISOString(),
      'date_to': point.dateTo.toISOString(),
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  static #adaptPointToClient(point) {
    const adaptedPoint = {
      ...point,
      'basePrice': point.base_price,
      'dateFrom': new Date(point.date_from),
      'dateTo': new Date(point.date_to),
      'isFavorite': point.is_favorite,
    };

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static #adaptPointsToClient(points) {
    return points.map((point) => PointsApiService.#adaptPointToClient(point));
  }
}
