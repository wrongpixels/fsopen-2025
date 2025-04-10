import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import { toPositiveNumber } from './utils';

const app = express();
app.use(express.json());

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (daily_exercises === undefined || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (!(daily_exercises instanceof Array)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  if (daily_exercises.length === 0) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  try {
    const realTarget = toPositiveNumber(target);
    const dayData: number[] = daily_exercises.map((d) => toPositiveNumber(d));
    res.json(calculateExercises({ target: realTarget, dayData }));
    return;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

app.get('/hello', (_req, res) => {
  res.send('Hello, Full Stack!');
});

app.get('/bmi', (req, res) => {
  if (!req.query.height || !req.query.weight) {
    res.status(400).json({ error: 'missing parameters' });
    return;
  }
  try {
    const [height, weight]: number[] = [
      toPositiveNumber(req.query.height as string),
      toPositiveNumber(req.query.weight as string),
    ];

    res.json({ weight, height, bmi: calculateBmi({ height, weight }) });
  } catch (e) {
    res.status(400).json({
      error: e instanceof Error ? e.message : 'malformatted parameters',
    });
  }
});

const PORT: number = 3003;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
