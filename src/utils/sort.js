import { SortTypes } from '../const';
import { sortByDay, sortByTime, sortByPrice } from './point';

const sort = {
  [SortTypes.DAY]: (points) => [...points].sort(sortByDay).reverse(),
  [SortTypes.TIME]: (points) => [...points].sort(sortByTime),
  [SortTypes.PRICE]: (points) => [...points].sort(sortByPrice)
};

export { sort };
