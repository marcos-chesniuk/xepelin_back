const { Pool } = require('pg');

const ssl = {
  rejectUnauthorized: false
}

const pool = new Pool({
  ssl: process.env.NODE_ENV === 'development' ? false : ssl
});

const query = (text, params, callback) => {
  return pool.query(text, params, callback)
};

module.exports = {
  query
}