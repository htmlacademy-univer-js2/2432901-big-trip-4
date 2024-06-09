import { sortByDay, sortByPrice, sortByTime } from './event.js';
import { SortType } from '../const.js';

const sort = {
  [SortType.DAY]: (events) => events.sort(sortByDay),
  [SortType.PRICE]: (events) => events.sort(sortByPrice),
  [SortType.TIME]: (events) => events.sort(sortByTime),
  [SortType.EVENT]: () => {
    throw new Error(`Sort by ${SortType.EVENT} is not implemented`);
  },
  [SortType.OFFER]: () => {
    throw new Error(`Sort by ${SortType.OFFER} is not implemented`);
  }
};

export {sort};
