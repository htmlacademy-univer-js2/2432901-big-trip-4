const isEscapeButton = (evt) => evt.key === 'Escape';

function capitalizeFirstLetter(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

export { isEscapeButton, capitalizeFirstLetter };
