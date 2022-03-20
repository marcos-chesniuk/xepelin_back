import { TypedRequestBody, ClientCreateBody } from "../utils/interfaces/request";
import { Response } from "express";
const { OK_RESPONSE, ERROR_RESPONSE } = require("../utils/responses");

const Router = require('express-promise-router');
const db = require('../db/queries');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const router = new Router();
module.exports = router;

router.get('/list', async (req: any, res: Response) => {
    const { rows } = await db.query('SELECT * FROM clients ORDER BY ID ASC');
    res.status(200).send(rows);
});
