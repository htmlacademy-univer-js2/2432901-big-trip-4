import { FilterType, SortTypes } from './const';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export function capitalizeFirstLetter(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

export const isPointPast = (point) => dayjs().isAfter(point.dateTo);
export const isPointPresent = (point) => dayjs().isBefore(point.dateTo) && dayjs().isAfter(point.dateFrom);
export const isPointFuture = (point) => dayjs().isBefore(point.dateFrom);

export const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
};

export const filterByPointType = {
  [FilterType.EVERYTHING]: (points) => points.length,
  [FilterType.PAST]: (points) => points.some((point) => isPointPast(point)),
  [FilterType.PRESENT]: (points) => points.some((point) => isPointPresent(point)),
  [FilterType.FUTURE]: (points) => points.some((point) => isPointFuture(point)),
};

export function formatDateToShortDate(date) {
  return dayjs(date).format('MMM DD');
}

export function formatDateToDateTime(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

export function formatDateToDateTimeHTML(date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

export function formatDateToTime(date) {
  return dayjs(date).format('HH:mm');
}

export function formatDuration(dateFrom, dateTo) {
  const timeDiff = dayjs.duration(dayjs(dateTo).diff(dateFrom));
  const asDays = Math.floor(timeDiff.asDays());
  const asHours = Math.floor(timeDiff.asHours());
  const pointDuration = [
    asDays > 0 ? `${String(asDays).padStart(2, '0')}D ` : '',
    asHours > 0 ? `${String(timeDiff.hours()).padStart(2, '0')}H ` : '',
    `${String(timeDiff.minutes()).padStart(2, '0')}M`
  ];
  return pointDuration.join('');
}
export const getDateDifference = (pointA, pointB) => dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
export const getDurationDifference = (pointA, pointB) => (dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom))) - (dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom)));
export const getPriceDifference = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sort = {
  [SortTypes.DAY]: (points) => [...points].sort(getDateDifference).reverse(),
  [SortTypes.TIME]: (points) => [...points].sort(getDurationDifference),
  [SortTypes.PRICE]: (points) => [...points].sort(getPriceDifference)
};

export function isBigDifference(pointA, pointB) {
  return pointA.dateFrom !== pointB.dateFrom || pointA.basePrice !== pointB.basePrice || getDurationDifference(pointA, pointB) !== 0;
}


