export const unformatCurrency = (value) => {
  if (typeof value === 'number') return value;
  return Number(value?.replace(/[^0-9.-]+/g, ""));
};