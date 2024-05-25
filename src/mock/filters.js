import { FilterOptions, FilterTypes } from '../const';

function generateFilters(points) {
  return Object.entries(FilterOptions).map(([filterType, filterPoints]) => ({
    type: filterType,
    hasPoints: filterPoints(points).length > 0,
    defaultFilterType: filterType === FilterTypes.EVERYTHING
  }));
}

export { generateFilters };
