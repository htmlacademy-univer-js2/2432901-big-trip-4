import ApiService from '../framework/api-service';
import { adaptToServer } from '../utils';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  async updateEvent(update) {
    const response = await this._load({
      url: `points/${update.id}`,
      method: 'PUT',
      body: JSON.stringify(adaptToServer(update)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
