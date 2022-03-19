if (process.env.NODE_ENV === 'prod') {
  require('dotenv').config({ path: __dirname+'/../.env' });
};
import express from 'express';

const mountRoutes = require('./routes');

const app = express();

mountRoutes(app);

let port = process.env.PORT || '3000';

app.listen(port, () => {
  return console.log(`${process.env.NODE_ENV.charAt(0).toUpperCase() + process.env.NODE_ENV.slice(1)} server is listening on port ${port}`);
});