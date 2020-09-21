export const toKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

export const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(\-\w)/g, (m) => m[1].toUpperCase());
};

export const toDotCase = (str: string) => {
  return str.replace(/(?!^)([A-Z])/g, ' $1')
    .replace(/[_\s]+(?=[a-zA-Z])/g, '.')
    .toLowerCase();
};

export const tryParseInt = (value: any) => {
  return (parseInt(value) == value && parseFloat(value) !== NaN) ? parseInt(value) : value;
};
