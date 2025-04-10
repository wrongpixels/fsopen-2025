import { toPositiveNumber } from './utils';

export interface BmiData {
  height: number;
  weight: number;
}

type BmiRange = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

const getBmiRange = (result: number): BmiRange => {
  if (result < 18.5) {
    return 'Underweight';
  }
  if (result >= 30) {
    return 'Obese';
  }
  if (result > 25) {
    return 'Overweight';
  }
  return 'Normal';
};

const getArguments = (): BmiData => {
  const args: string[] = process.argv;
  if (args.length < 4 || args.length > 4) {
    throw new Error(
      args.length < 4 ? 'Error: Missing arguments' : 'Error: Too many arguments'
    );
  }
  return {
    height: toPositiveNumber(args[2]),
    weight: toPositiveNumber(args[3]),
  } as BmiData;
};

export const calculateBmi = (values: BmiData): string => {
  const result: number = values.weight / (values.height / 100) ** 2;
  return `${getBmiRange(result)} range`;
};
if (require.main === module) {
  try {
    console.log(calculateBmi(getArguments()));
  } catch (e) {
    console.log(
      e instanceof Error
        ? `Error: ${e.message}`
        : 'Error: Something went wrong!'
    );
  }
}
