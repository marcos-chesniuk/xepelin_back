import express from 'express';

const db = require('./queries');

const app = express();
//const port = 3000;
let port = process.env.PORT;
if (port == null || port == "") {
  port = '3000';
}

app.get('/', (req, res) => {
  res.send('Test OK!');
});

app.get('/clients', db.getClients);

app.listen(port, () => {
  return console.log(`Server is listening on port ${port}`);
});