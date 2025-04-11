import express from 'express';
import cors from 'cors';
const PORT = 3001;

const app = express();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  console.log('Received ping request!');
  res.send('Pong!');
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
