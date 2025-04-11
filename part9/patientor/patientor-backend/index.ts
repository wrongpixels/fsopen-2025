import express from 'express';
const PORT = 4000;

const app = express();
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.send('Pong!');
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
