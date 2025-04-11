import express from 'express';
import diagnoseRouter from './routes/diagnoses';
import cors from 'cors';
const PORT = 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/diagnoses', diagnoseRouter);

app.get('/api/ping', (_req, res) => {
  console.log('Received ping request!');
  res.send('Pong!');
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
