import { FilterOptions, FilterTypes, UpdateType } from '../const';
import { remove, render, replace } from '../framework/render';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filtersModel = null;
  #filterComponent = null;

  constructor({ container, pointsModel, filtersModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filtersModel.addObserver(this.#modelEventHandler);
  }

  init() {
    const previousFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      activeFilters: this.#getActiveFilters(this.#pointsModel.points),
      selectedFilter: this.#filtersModel.filter,

      onFilterTypeChange: this.#filterTypeChangeHandler
    });

    if (previousFilterComponent === null) {
      render(this.#filterComponent, this.#container);
    }
    else {
      replace(this.#filterComponent, previousFilterComponent);
      remove(previousFilterComponent);
    }
  }

  #getActiveFilters(points) {
    return Object.values(FilterTypes).filter((type) => FilterOptions[type](points));
  }

  #filterTypeChangeHandler = (filterType) => {
    this.#filtersModel.set(UpdateType.MAJOR, filterType);
  };

  #modelEventHandler = (updateType) => {
    if (updateType !== UpdateType.PATCH) {
      this.init();
    }
  };
}
