import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { TimePeriods } from '../const';

dayjs.extend(duration);

function formatDateToShortDate(date) {
  return dayjs(date).format('MMM DD');
}

function formatDateToDateTime(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

function formatDateToDateTimeHTML(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

function formatDateToTime(date) {
  return dayjs(date).format('HH:mm');
}

function formatDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  if (timeDiff >= TimePeriods.MSEC_IN_DAY) {
    return dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
  } else if (timeDiff >= TimePeriods.MSEC_IN_HOUR) {
    return dayjs.duration(timeDiff).format('HH[H] mm[M]');
  }
  return dayjs.duration(timeDiff).format('mm[M]');
}

const isPointPast = (point) => dayjs().isAfter(point.dateTo);
const isPointPresent = (point) => dayjs().isBefore(point.dateTo) && dayjs().isAfter(point.dateFrom);
const isPointFuture = (point) => dayjs().isBefore(point.dateFrom);

function sortByDay(pointA, pointB) {
  return new Date(pointB.dateFrom) - new Date(pointA.dateFrom);
}
function sortByTime(pointA, pointB) {
  const durationA = pointA.dateTo - pointA.dateFrom;
  const durationB = pointB.dateTo - pointB.dateFrom;

  return durationB - durationA;
}
function sortByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function isBigDifference(pointA, pointB) {
  return pointA.dateFrom !== pointB.dateFrom || pointA.basePrice !== pointB.basePrice || sortByTime(pointA, pointB) !== 0;
}

export { formatDateToShortDate, formatDateToDateTimeHTML, formatDateToDateTime, formatDateToTime, formatDuration, isPointPast, isPointPresent, isPointFuture, sortByDay, sortByTime, sortByPrice, isBigDifference };
