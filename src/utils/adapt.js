function adaptToClient(event) {
  const adaptedEvent = {
    ...event,
    price: event['base_price'],
    dateFrom: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'],
    dateTo: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'],
    isFavorite: event['is_favorite']
  };

  delete adaptedEvent['base_price'];
  delete adaptedEvent['date_from'];
  delete adaptedEvent['date_to'];
  delete adaptedEvent['is_favorite'];

  return adaptedEvent;
}

function adaptToServer(event) {
  const adaptedEvent = {
    ...event,
    ['base_price']: Number(event.price),
    ['date_from']: event.dateFrom instanceof Date ? event.dateFrom.toISOString() : null,
    ['date_to']: event.dateTo instanceof Date ? event.dateTo.toISOString() : null,
    ['is_favorite']: event.isFavorite
  };

  delete adaptedEvent.price;
  delete adaptedEvent.dateFrom;
  delete adaptedEvent.dateTo;
  delete adaptedEvent.isFavorite;

  return adaptedEvent;
}

export {
  adaptToClient,
  adaptToServer
};
