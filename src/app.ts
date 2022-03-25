if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname+'/../.env' });
};
import express from 'express';

require('./tasks/csv-data')();

const mountRoutes = require('./routes');

const app = express();

mountRoutes(app);

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
  });

let port = process.env.PORT || '3000';

app.listen(port, () => {
  const environment = process.env.NODE_ENV;
  const capitalizedEnvironment = environment.charAt(0).toUpperCase() + environment.slice(1);
  return console.log(`${capitalizedEnvironment} server is listening on port ${port}`);
});