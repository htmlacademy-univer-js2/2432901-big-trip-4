import dayjs from 'dayjs';

const TimePeriods = {
  MINS_IN_HOUR: 60,
  HOURS_IN_DAY : 24,
  MINS_IN_DAY : 60 * 24,
  DAY_IN_MONTH : 31
};

function getDateDiff(dateFrom, dateTo) {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom), 'm');

  if (Math.ceil(diff / TimePeriods.MINS_IN_DAY) > 1){
    return `${Math.ceil(diff / TimePeriods.MINS_IN_DAY)} D`;
  }

  if (Math.ceil(diff / TimePeriods.MINS_IN_HOUR) > 1){
    return `${Math.ceil(diff / TimePeriods.MINS_IN_HOUR)} H`;
  }
  return `${Math.ceil(diff)} M`;
}

function getTime(date) {
  return dayjs(date).format('hh:mm');
}

function getMonthAndDay(date) {
  return dayjs(date).format('MMM DD');
}

function getFullDate(date) {
  return dayjs(date).format('DD/MM/YY hh:mm');
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomValue(lower = 0, upper = 1000) {
  return Math.round((upper - lower) * Math.random() + lower);
}

function getDate({next}) {
  let date = dayjs().subtract(getRandomValue(0, TimePeriods.DAY_IN_MONTH), 'day').toDate();
  const minsGap = getRandomValue(0, TimePeriods.MINS_IN_HOUR);
  const hoursGap = getRandomValue(0, TimePeriods.HOURS_IN_DAY);

  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .toDate();
  }

  return date;
}

export { getDateDiff, getTime, getMonthAndDay, getFullDate, getRandomArrayElement, getDate, getRandomValue };
