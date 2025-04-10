import { toPositiveNumber } from './utils';
type Rating = 1 | 2 | 3;

const getDescription = (rating: Rating): string => {
  switch (rating) {
    case 3:
      return 'Hey, way too go! Good work!';
    case 2:
      return 'Not too bad, but could be better';
    case 1:
      return 'Actually too bad and could definitely be better';
  }
};

const getRating = (average: number, target: number): Rating => {
  const percent: number = (average * 100) / target;
  return percent < 75 ? 1 : percent > 100 ? 3 : 2;
};

interface ResultData {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExercisePeriod {
  target: number;
  dayData: number[];
}

const getPeriodFromArgs = (): ExercisePeriod => {
  const args: string[] = process.argv;
  if (args.length < 4) {
    throw new Error(
      `Error: Provide at least 2 arguments to run the program!
      (Format: 'Target daily hours' 'Day 1 Hours' 'Day 2 Hours'... etc)`
    );
  }
  const target: number = toPositiveNumber(args[2]);
  const dayData: number[] = args
    .slice(3, args.length)
    .map((d) => toPositiveNumber(d));
  return { target, dayData } as ExercisePeriod;
};

export const calculateExercises = ({
  dayData,
  target,
}: ExercisePeriod): ResultData => {
  const average: number =
    dayData.reduce((a: number, b: number) => a + b, 0) / dayData.length;
  const rating: Rating = getRating(average, target);

  return {
    periodLength: dayData.length,
    trainingDays: dayData.filter((d: number): boolean => d > 0).length,
    success: average >= target,
    rating,
    ratingDescription: getDescription(rating),
    target: target,
    average,
  } as ResultData;
};

if (require.main === module) {
  try {
    console.log(calculateExercises(getPeriodFromArgs()));
  } catch (e) {
    console.log(
      e instanceof Error
        ? `Error: ${e.message}`
        : 'Error: Something went wrong!'
    );
  }
}
