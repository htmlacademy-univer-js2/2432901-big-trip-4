import dayjs from 'dayjs';
import { SortType } from '../const';
import { sort } from './sort';

function getTripInfoTitle(events = [], destinations = []) {
  const tripDestinations = sort[SortType.DAY]([...events]).map((event) => destinations.find((destination) => destination.id === event.destination).name);

  if (tripDestinations.length <= 3) {
    return tripDestinations.join('&nbsp;&mdash;&nbsp;');
  }
  else {
    return`${tripDestinations.at(0)}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${tripDestinations.at(-1)}`;
  }
}

function getTripInfoDuration(points = []) {
  const sortedPoints = sort[SortType.DAY]([...points]);
  if (sortedPoints.length > 0) {
    return `${dayjs(sortedPoints.at(0).dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(sortedPoints.at(-1).dateFrom).format('DD MMM')}`;
  }
  else {
    return '';
  }
}

function getOffersCost(offerIds = [], offers = []) {
  const offersPriceById = offers.reduce((priceMap, offer) => {
    if (offer && offer.id && typeof offer.price === 'number') {
      priceMap[offer.id] = offer.price;
    }
    return priceMap;
  }, {});

  return offerIds.reduce((totalCost, id) => {
    const offerCost = offersPriceById[id];
    return totalCost + (typeof offerCost === 'number' ? offerCost : 0);
  }, 0);
}

function getTotalTripCost(points = [], offers = []) {
  const offersByType = offers.reduce((offersObj, offer) => {
    offersObj[offer.type] = offer.offers;
    return offersObj;
  }, {});

  return points.reduce((totalCost, point) => {
    const pointOffers = offersByType[point.type] || [];
    return totalCost + point.price + getOffersCost(point.offers, pointOffers);
  }, 0);
}

export { getTripInfoTitle, getTripInfoDuration, getTotalTripCost };
