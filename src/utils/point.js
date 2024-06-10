import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

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

const isPointPast = (point) => dayjs().isAfter(point.dateTo);
const isPointPresent = (point) => dayjs().isBefore(point.dateTo) && dayjs().isAfter(point.dateFrom);
const isPointFuture = (point) => dayjs().isBefore(point.dateFrom);

const getDateDifference = (pointA, pointB) => dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
const getDurationDifference = (pointA, pointB) => (dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom))) - (dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom)));
const getPriceDifference = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

function isBigDifference(pointA, pointB) {
  return pointA.dateFrom !== pointB.dateFrom
    || pointA.basePrice !== pointB.basePrice
    || getDurationDifference(pointA, pointB) !== 0;
}

export {
  formatDateToShortDate,
  formatDateToDateTimeHTML,
  formatDateToDateTime,
  formatDateToTime,
  formatDuration,
  isPointPast,
  isPointPresent,
  isPointFuture,
  getDateDifference,
  getDurationDifference,
  getPriceDifference,
  isBigDifference
};
