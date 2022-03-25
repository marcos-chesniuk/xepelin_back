// import { TypedRequestBody, ClientCreateBody } from "../utils/interfaces/request";
import { DbInvoice } from "../utils/interfaces/invoices";
import { Response } from "express";
const { OK_RESPONSE, ERROR_RESPONSE } = require("../utils/responses");
const axios = require('axios');

const Router = require('express-promise-router');
const db = require('../db/queries');

const router = new Router();
module.exports = router;

router.get('/list/:currencyId?', async (req: any, res: Response) => {
    const currencyId = req.params.currencyId ? req.params.currencyId : req.headers.clientcurrencyid;
    
    const vendorId = req.query.vendorId;
    const invoiceDateStart = req.query.invoiceDateStart;
    const invoiceDateEnd = req.query.invoiceDateEnd;

    console.log(invoiceDateStart, typeof invoiceDateEnd)
    console.log(invoiceDateEnd, typeof invoiceDateEnd)

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
            SELECT "INVOICE_ID", "VENDOR_ID", "INVOICE_NUMBER", "INVOICE_TOTAL", "PAYMENT_TOTAL", "CREDIT_TOTAL", "BANK_ID", "CURRENCY"
                FROM "INVOICES"${whereClause}
        `);
        result = await convertCurrency(rows, parseInt(currencyId, 10));

        status = 200;
        message = OK_RESPONSE;

    } catch (error) {
        console.log(error)
        status = 500;
        message = ERROR_RESPONSE(error.detail);
        
    } finally {
        if (result) message.result = result;
        res.status(status).send(message);
    };
});


const formDateWhere = (start: string | undefined, end: string | undefined): string => {
    if (start && end) {
        return `"INVOICE_DATE" BETWEEN ${start} AND ${end}`;
    } else {
        return `"INVOICE_DATE" ${start ? '>=' : '<='} '${start ? start : end}'`;
    }
}


const convertCurrency = async (data: Array<DbInvoice>, currencyId: number): Promise<any[]> => {
    let convertedArr = [];

    const { rows } = await db.query(`SELECT * FROM "currencies"`);
    const currencies: any[] = rows;

    const currencyToIndex = currencies.findIndex( x => x.id === currencyId );

    if (currencyToIndex === -1) {
        throw {
            detail: `There is no currency with id ${currencyId}`
        }
    }

    const currencyTo = currencies.splice(currencyToIndex, 1)[0];

    let converterUrl = `${process.env.C_CONV_URL}convert?q=`;

    currencies.forEach(currency => {
        converterUrl += `${currency.abbreviation}_${currencyTo.abbreviation},`;
    });

    converterUrl = converterUrl.substring(0, converterUrl.length - 1);
    converterUrl += `&compact=ultra&apiKey=${process.env.C_CONV_KEY}`;

    const convertionRate = await axios.get(converterUrl).then(response => response.data);
    
    data.forEach((invoice) => {
        let convertedInvoice = {};

        if(invoice.CURRENCY != currencyTo.abbreviation) {
            convertedInvoice = {
                invoiceId: invoice.INVOICE_ID,
                vendorId: invoice.VENDOR_ID,
                invoiceNumber: invoice.INVOICE_NUMBER,
                invoiceTotal: parseFloat(invoice.INVOICE_TOTAL) * convertionRate[`${invoice.CURRENCY}_${currencyTo.abbreviation}`],
                paymentTotal: parseFloat(invoice.PAYMENT_TOTAL) * convertionRate[`${invoice.CURRENCY}_${currencyTo.abbreviation}`],
                creditTotal: parseFloat(invoice.CREDIT_TOTAL) * convertionRate[`${invoice.CURRENCY}_${currencyTo.abbreviation}`],
                bankId: invoice.BANK_ID
            };

        } else {
            convertedInvoice = {
                invoiceId: invoice.INVOICE_ID,
                vendorId: invoice.VENDOR_ID,
                invoiceNumber: invoice.INVOICE_NUMBER,
                invoiceTotal: parseFloat(invoice.INVOICE_TOTAL),
                paymentTotal: parseFloat(invoice.PAYMENT_TOTAL),
                creditTotal: parseFloat(invoice.CREDIT_TOTAL),
                bankId: invoice.BANK_ID
            };
        }

        convertedArr.push(convertedInvoice);

    });

    return convertedArr;
}