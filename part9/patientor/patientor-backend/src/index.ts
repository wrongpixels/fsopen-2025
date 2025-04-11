import express from 'express';
import diagnosesRouter from './routes/diagnoses';
import PatientsRouter from './routes/patients';
import cors from 'cors';
const PORT = 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', PatientsRouter);

app.get('/api/ping', (_req, res) => {
  console.log('Received ping request!');
  res.send('Pong!');
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
