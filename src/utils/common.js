const isEscapeKey = (evt) => evt.key === 'Escape';

function firstLetterToUpperCase(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function firstLetterToLowerCase(type) {
  return type.toLowerCase();
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {
  firstLetterToUpperCase,
  firstLetterToLowerCase,
  updateItem,
  isEscapeKey};
