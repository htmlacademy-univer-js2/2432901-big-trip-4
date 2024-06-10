import { render, replace, remove } from '../framework/render.js';
import { FilterType, UpdateType } from '../const.js';
import { some } from '../utils/filter.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #pointsModel = null;
  #filterView = null;

  constructor({ container, filterModel, pointsModel }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#pointsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    const prevFilterView = this.#filterView;

    this.#filterView = new FilterView({
      activeFilters: this.#getActiveFilters(this.#pointsModel.get()),
      selectedFilter: this.#filterModel.get(),
      onFilterTypeChange: this.#filterTypeChangeHandler,
    });

    if (prevFilterView === null) {
      render(this.#filterView, this.#container);
    } else {
      replace(this.#filterView, prevFilterView);
      remove(prevFilterView);
    }
  }

  #getActiveFilters(points) {
    return Object.values(FilterType).filter((type) => some[type](points));
  }

  #filterTypeChangeHandler = (filterType) => {
    this.#filterModel.set(UpdateType.MAJOR, filterType);
  };

  #modelEventHandler = (updateType) => {
    if (updateType !== UpdateType.PATCH) {
      this.init();
    }
  };
}
