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
  console.log(percent);
  return percent < 75 ? 1 : percent > 100 ? 3 : 2;
};

interface resultData {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dayData: number[], target: number): resultData => {
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
  };
};

try {
  console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
} catch (e) {
  console.log(
    e instanceof Error ? `Error: ${e.message}` : 'Error: Something went wrong!'
  );
}
