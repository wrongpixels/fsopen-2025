export const toNumber = (value: unknown): number => {
  const num: number = Number(value);
  if (isNaN(num)) {
    throw new Error(`Error: '${value}' is not a number`);
  }
  return num;
};

export const toPositiveNumber = (value: unknown): number => {
  const num: number = toNumber(value);
  if (num < 0) {
    throw new Error(`Error: ${value} must be a positive number!`);
  }
  return num;
};
