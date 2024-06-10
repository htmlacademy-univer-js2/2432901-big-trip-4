import { FilterType } from '../const.js';
import { isPointPast, isPointPresent, isPointFuture } from './point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
};

const some = {
  [FilterType.EVERYTHING]: (points) => points.length,
  [FilterType.PAST]: (points) => points.some((point) => isPointPast(point)),
  [FilterType.PRESENT]: (points) => points.some((point) => isPointPresent(point)),
  [FilterType.FUTURE]: (points) => points.some((point) => isPointFuture(point)),
};

export { filter, some };
