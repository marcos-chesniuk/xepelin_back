import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Test OK');
});

app.listen(port, () => {
  return console.log(`Server is listening on port ${port}`);
});