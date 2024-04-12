import dayjs from 'dayjs';
import { FilterType } from './const.js';

const filter = {
  [FilterType.EVERYTHING] : () => true,
  [FilterType.FUTURE] : (point) => dayjs().isBefore(dayjs(point.dateFrom)),
  [FilterType.PAST] : (point) => dayjs().isAfter(dayjs(point.dateTo)),
  [FilterType.PRESENT] : (point) => dayjs().isAfter(dayjs(point.dateFrom)) && dayjs().isBefore(dayjs(point.dateTo))
};

export { filter };
