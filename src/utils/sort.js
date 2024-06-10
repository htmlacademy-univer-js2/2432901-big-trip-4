import { SortTypes } from '../const';
import { getDateDifference, getDurationDifference, getPriceDifference } from './point';

const sort = {
  [SortTypes.DAY]: (points) => [...points].sort(getDateDifference).reverse(),
  [SortTypes.TIME]: (points) => [...points].sort(getDurationDifference),
  [SortTypes.PRICE]: (points) => [...points].sort(getPriceDifference)
};

export { sort };
