import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { toPositiveNumber } from './utils';

const app = express();

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
