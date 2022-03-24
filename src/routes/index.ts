import { Response } from "express";
const clients = require('./clients');
const invoices = require('./invoices');

module.exports = app => {
    app.get('/', (req: any, res: Response) => {
        res.send('Test OK!');
    });
    
    app.use('/clients', clients);
    app.use('/invoices', invoices);
}