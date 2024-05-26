import { Duration } from './const';
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

function formatStringToDateTime(date) {
  return dayjs(date).format('YY/MM/DD HH:mm');
}

function formatStringToShortDate(date) {
  return dayjs(date).format('MMM DD');
}

function formatStringToTime(date) {
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

function getDate({ next }) {
  const minsGap = getRandomInteger(0, Duration.MINUTE);
  const hoursGap = getRandomInteger(1, Duration.HOUR);
  const daysGap = getRandomInteger(0, Duration.DAY);
  let date = dayjs().subtract(getRandomInteger(0, Duration.DAY), 'day').toDate();

  if (next) {
    date = dayjs(date).add(minsGap, 'minute').add(hoursGap, 'hour').add(daysGap, 'day').toDate();
  }

  return date;
}


function getFullDate(date) {
  return dayjs(date).format('DD/MM/YY hh:mm');
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
  return pointA.dateFrom !== pointB.dateFrom || pointA.basePrice !== pointB.basePrice || sortByTime(pointA, pointB) !== 0;
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

export {getRandomInteger, getRandomValue, formatStringToDateTime, formatStringToShortDate, formatStringToTime, getPointDuration, getDate, isPointFuture, isPointPresent, isPointPast, updatePoint, sortByDay, sortByTime, sortByPrice, sortByEvent, sortByOffers, isBigDifference, getFullDate, adaptToClient, adaptToServer, isEscapeButton};
