export const FILESIZE_UNITS = ['MB', 'GB', 'TB', 'PB'];

export const formatFilesize = input => {
  if (isNaN(parseFloat(input)) || ! isFinite(input)) {
    return '?';
  }

  if (input === -1) {
    return '∞';
  }

  if (input === 0) {
    return input;
  }

  let unit = 0;

  while (input >= 1024) {
    input /= 1024;
    unit++;
  }

  return Math.floor(input * 10) / 10 + ' ' + FILESIZE_UNITS[unit];
};

const SNAKE_CASE_REGEXP = /[A-Z]/g;

export const formatSnakeCase = input =>
  input.replace(SNAKE_CASE_REGEXP, (letter, pos) =>
    (pos ? '-' : '') + letter.toLowerCase());

export const flatten = lists => Array.prototype.concat.apply([], lists);

export const listToDict = (key, value) => list => {
  const dict = {};
  list.forEach(item => {
    dict[key(item)] = value(item);
  });
  return dict;
};

export const getUUID = url => url.split('/').splice(-2)[0];
