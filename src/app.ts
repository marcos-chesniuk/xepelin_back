if (process.env.NODE_ENV === 'prod') {
  require('dotenv').config({ path: __dirname+'/../.env' });
};
import express from 'express';

require('./tasks/csv-data')();

const mountRoutes = require('./routes');

const app = express();

mountRoutes(app);

let port = process.env.PORT || '3000';

app.listen(port, () => {
  const environment = process.env.NODE_ENV;
  const capitalizedEnvironment = environment.charAt(0).toUpperCase() + environment.slice(1);
  return console.log(`${capitalizedEnvironment} server is listening on port ${port}`);
});