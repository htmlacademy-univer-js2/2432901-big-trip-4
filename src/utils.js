import { SortTypes, SortingOptions } from './const';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const TimePeriods = {
  MSEC_IN_SEC : 1000,
  SEC_IN_MIN : 60,
  MIN_IN_HOUR : 60,
  HOUR_IN_DAY : 24,
  MSEC_IN_HOUR : 60 * 60 * 1000,
  MSEC_IN_DAY : 24 * 60 * 60 * 1000,
};

function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomValue(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

function isEscapeButton (evt) {
  return evt.key === 'Escape';
}

function getFullDate(date) {
  return dayjs(date).format('YY/MM/DD HH:mm');
}

function getMonthAndDay(date) {
  return dayjs(date).format('MMM DD');
}

function getTime(date) {
  return dayjs(date).format('HH:mm');
}

function getPointDuration(point) {
  const timeDiff = dayjs(point.dateTo).diff(dayjs(point.dateFrom));

  let pointDuration = 0;

  switch (true) {
    case (timeDiff >= TimePeriods.MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= TimePeriods.MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < TimePeriods.MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }

  return pointDuration;
}


function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

function isPointPresent(point) {
  return dayjs().isBefore(point.dateTo) && dayjs().isAfter(point.dateFrom);
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function updatePoint(points, update) {
  return points.map((point) => point.id === update.id ? update : point);
}

function sortByDay(pointA, pointB) {
  return new Date(pointA.dateFrom) - new Date(pointB.dateFrom);
}

function sortByEvent(pointA, pointB) {
  return (pointA.type.toLowerCase()).localeCompare(pointB.type.toLowerCase());
}

function sortByTime(pointA, pointB) {
  const durationA = pointA.dateTo - pointA.dateFrom;
  const durationB = pointB.dateTo - pointB.dateFrom;

  return durationB - durationA;
}

function sortByPrice(pointA, pointB) {
  return pointB.price - pointA.price;
}

function sortByOffers(pointA, pointB) {
  return pointA.offers.length - pointB.offers.length;
}

function isBigDifference(pointA, pointB) {
  return pointA.dateFrom !== pointB.dateFrom || pointA.price !== pointB.price || sortByTime(pointA, pointB) !== 0;
}

function adaptToClient(point) {
  const adaptedPoint = {
    ...point,
    price: point['base_price'],
    dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
    dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
    isFavorite: point['is_favorite']
  };

  delete adaptedPoint['base_price'];
  delete adaptedPoint['date_from'];
  delete adaptedPoint['date_to'];
  delete adaptedPoint['is_favorite'];
  return adaptedPoint;
}

function adaptToServer(point) {
  const adaptedPoint = {
    ...point,
    ['base_price']: Number(point.price),
    ['date_from']: point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
    ['date_to']: point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
    ['is_favorite']: point.isFavorite
  };

  delete adaptedPoint.price;
  delete adaptedPoint.dateFrom;
  delete adaptedPoint.dateTo;
  delete adaptedPoint.isFavorite;
  return adaptedPoint;
}

function getTripInfoTitle(points = [], destinations = []) {
  const tripDestinations = SortingOptions[SortTypes.DAY]([...points]).map((point) => destinations.find((destination) => destination.id === point.destination).name);
  if (tripDestinations.length <= 3) {
    return tripDestinations.join('&nbsp;&mdash;&nbsp;');
  }
  else {
    return`${tripDestinations.at(0)}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${tripDestinations.at(-1)}`;
  }
}

function getTripInfoDuration(points = []) {
  const sortedPoints = SortingOptions[SortTypes.DAY]([...points]);
  if (sortedPoints.length > 0) {
    return `${dayjs(sortedPoints.at(0).dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(sortedPoints.at(-1).dateFrom).format('DD MMM')}`;
  }
  else {
    return '';
  }
}

function getTripOffersCost(offerIds = [], offers = []) {
  const offersMap = new Map(offers.map((offer) => [offer.id, offer.price]));
  return offerIds.reduce((cost, id) => cost + (offersMap.get(id) || 0), 0);
}

function getTripInfoCost(points = [], offers = []) {
  const offersMap = new Map(offers.map((offer) => [offer.type, offer.offers]));
  return points.reduce((cost, point) => {
    const pointOffers = offersMap.get(point.type) || [];
    return cost + point.price + getTripOffersCost(point.offers, pointOffers);
  }, 0);
}

export {getRandomInteger, getRandomValue, getFullDate, getMonthAndDay, getTime, getPointDuration, isPointFuture, isPointPresent, isPointPast, updatePoint, sortByDay, sortByTime, sortByPrice, sortByEvent, sortByOffers, isBigDifference, adaptToClient, adaptToServer, isEscapeButton, getTripInfoTitle, getTripInfoDuration, getTripInfoCost};
