const { Client, Pool } = require('pg');

const ssl = {
  rejectUnauthorized: false
}

// const client = new Client({
//   connectionString: process.env.DATABASE_URL_LOCAL,
//   ssl: process.env.NODE_ENV === 'development' ? false : ssl
// });

const pool = new Pool({
  ssl: process.env.NODE_ENV === 'development' ? false : ssl
});

const query = (text, params, callback) => {
  return pool.query(text, params, callback)
};

const getClients = (req, resp) => {
  pool.connect();
  pool.query('SELECT * FROM clients ORDER BY ID ASC', (err, res) => {
    if (err) {
      throw err;
    }

    resp.status(200).json(res.rows);
    pool.end();
  });
};

module.exports = {
  getClients
}