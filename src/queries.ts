const { Client } = require('pg');

const ssl = {
  rejectUnauthorized: false
}

const client = new Client({
  connectionString: process.env.DATABASE_URL_LOCAL,
  ssl: process.env.NODE_ENV === 'development' ? false : ssl
});


/* const pool = new Pool({
  user: 'vank',
  host: 'localhost',
  database: 'vank',
  password: 'vank',
  port: 5432,
}); */

const getClients = (req, resp) => {
  client.connect();
  client.query('SELECT * FROM clients ORDER BY ID ASC', (err, res) => {
    if (err) {
      throw err;
    }

    resp.status(200).json(res.rows);
    client.end();
  });
};

module.exports = {
  getClients
}