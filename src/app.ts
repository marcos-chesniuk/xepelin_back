if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname+'/../.env' });
}

import express from 'express';

const db = require('./queries');

const app = express();

console.log(process.env.NODE_ENV);
console.log(process.env.DATABASE_URL);
console.log(process.env.LALO);


let port = process.env.PORT || '3000';

app.get('/', (req, res) => {
  res.send('Test OK!');
});

app.get('/clients', db.getClients);

app.listen(port, () => {
  
  return console.log(`Server is listening on port ${port}`);
});