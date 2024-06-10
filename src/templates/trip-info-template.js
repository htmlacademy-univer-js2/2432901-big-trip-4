import dayjs from 'dayjs';
import he from 'he';

function createTotalCostTemplate({ totalCost }) {
  return `
    <p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${he.encode(String(totalCost))}</span>
    </p>
  `;
}

function getDateRange(dateFrom, dateTo) {
  return `${(dayjs(dateFrom)).format('DD MMM')}&nbsp;—&nbsp;${(dayjs(dateTo)).format('DD MMM')}`;
}

function createPathTemplate({ short, destinations, dateFrom, dateTo }) {
  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">
        ${he.encode(short ? `${destinations[0]} — ... — ${destinations[destinations.length - 1]}` : destinations.join(' — '))}</h1>
      <p class="trip-info__dates">${getDateRange(dateFrom, dateTo)}</p>
    </div>
  `;
}

export function createTripInfoTemplate({ short, destinations, dateFrom, dateTo, totalCost }) {
  return `
    <section class="trip-main__trip-info  trip-info">
      ${createPathTemplate({ short, destinations, dateFrom, dateTo })}
      ${createTotalCostTemplate({ totalCost })}
    </section>
  `;
}
