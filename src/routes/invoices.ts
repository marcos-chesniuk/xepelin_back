import { TypedRequestBody, ClientCreateBody } from "../utils/interfaces/request";
import { Response } from "express";
const { OK_RESPONSE, ERROR_RESPONSE } = require("../utils/responses");
// const db = require('../db/connection');

const Router = require('express-promise-router');
const bodyParser = require('body-parser');
const db = require('../db/queries');


const jsonParser = bodyParser.json();

const router = new Router();
module.exports = router;

router.get('/list/:currencyId?', async (req: any, res: Response) => {
    const currencyId = req.params.currencyId ? req.params.currencyId : req.headers.clientcurrencyid;

    console.log(currencyId);
    
    const vendorId = req.query.vendorId;
    const invoiceDateStart = req.query.invoiceDateStart;
    const invoiceDateEnd = req.query.invoiceDateEnd;

    let whereClause = '';

    if (vendorId || invoiceDateStart || invoiceDateEnd) {
        whereClause = ' WHERE ';
    
        if (vendorId && (invoiceDateStart || invoiceDateEnd)) {
            whereClause += `"VENDOR_ID" = ${vendorId} AND ${formDateWhere(invoiceDateStart, invoiceDateEnd)}`;
        } else if (vendorId) {
            whereClause += `"VENDOR_ID" = ${vendorId}`;
        } else {
            whereClause += formDateWhere(invoiceDateStart, invoiceDateEnd);
        }
    }

    let status;
    let message;
    let result = null;

    try {
        const { rows } = await db.query(`
            SELECT "INVOICE_ID", "VENDOR_ID", "INVOICE_NUMBER", "INVOICE_TOTAL", "PAYMENT_TOTAL", "CREDIT_TOTAL", "BANK_ID"
                FROM "INVOICES"${whereClause}
        `);
        // console.log(rows)
        result = rows;
        status = 200;
        message = OK_RESPONSE;

    } catch (error) {
        console.log(error)
        status = 500;
        message = ERROR_RESPONSE(error.detail);
        
    } finally {
        message.result = result;
        res.status(status).send(message);
    };
});


const formDateWhere = (start, end): string => {
    if (start && end) {
        return `"INVOICE_DATE" BETWEEN ${start} AND ${end}`;
    } else {
        return `"INVOICE_DATE" ${start ? '>=' : '<='} ${start ? start : end}`;
    }
}