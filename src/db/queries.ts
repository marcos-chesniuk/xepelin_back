const { Pool } = require('pg');

const ssl = {
  rejectUnauthorized: false
}

const pool = new Pool({
  ssl: ssl
});

const query = (text, params, callback) => {
  return pool.query(text, params, callback)
};

module.exports = {
  query
}