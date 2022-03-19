const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'vank',
  host: 'localhost',
  database: 'vank',
  password: 'vank',
  port: 5432,
});

const getClients = (req, resp) => {
  pool.query('SELECT * FROM clients ORDER BY ID ASC', (err, res) => {
    if (err) {
      throw err;
    }

    resp.status(200).json(res.rows);
  });
};

module.exports = {
  getClients
}