import { TypedRequestBody, ClientCreateBody, ClientEditBody } from "../utils/interfaces/request";
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
            INSERT INTO clients (internal_code, company_name, tax_id, currency_id, monthly_quota, bank_registry)
                VALUES ($1, $2, $3, $4, $5, $6)`,
            [ 
                params.internalCode,
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
        console.log(error)
        status = 500;
        message = ERROR_RESPONSE(error.detail);
        
    } finally {
        res.status(status).send(message)
    };

});

router.put('/edit', jsonParser, async (req: TypedRequestBody<ClientEditBody>, res: Response) => {
    const { taxId, currencyId } = req.body;
    const internalCode = req.headers.internalcode;

    let status = 200;
    let message;

    try {
        await db.query(`
            UPDATE clients
                SET "tax_id" = $1, "currency_id" = $2
                WHERE "internal_code" = $3
            `,
            [ taxId, currencyId, internalCode ]);

        message = OK_RESPONSE;

    } catch (error) {
        console.error(error);

        status = 500;
        message = ERROR_RESPONSE(error.detail);
        
    } finally {
        res.status(status).send(message)
    };

});
