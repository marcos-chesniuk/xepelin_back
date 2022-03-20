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

router.post('/create', jsonParser, async (req: TypedRequestBody<ClientCreateBody>, res: Response) => {
    const params = req.body;

    let status = 200;
    let message;

    try {
        await db.query(`
            INSERT INTO clients (internal_id, company_name, tax_id, currency_id, monthly_quota, bank_registry)
                VALUES ($1, $2, $3, $4, $5, $6)`,
            [ 
                params.internalId,
                params.companyName,
                params.taxId,
                params.currencyId,
                params.monthlyQuota,
                params.bankRegistry
            ]
        );
        status = 200;
        message = OK_RESPONSE;

    } catch (error) {
        status = 500;
        message = ERROR_RESPONSE(error.detail);
        
    } finally {
        res.status(status).send(message)
    };

});
