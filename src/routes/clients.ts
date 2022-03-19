const Router = require('express-promise-router');
const db = require('../db/queries');

const router = new Router();

module.exports = router;

router.get('/list', async (req, res) => {
    const { rows } = await db.query('SELECT * FROM clients ORDER BY ID ASC');
    res.status(200).send(rows);
});
