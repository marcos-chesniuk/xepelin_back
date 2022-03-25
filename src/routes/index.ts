import { Response } from "express";
const clients = require('./clients');
const invoices = require('./invoices');
const cors = require('cors')

module.exports = app => {
    app.get('/healtz', (req: any, res: Response) => {
        res.send('Test OK!');
    });

    app.use(cors())
    
    app.use('/clients', clients);
    app.use('/invoices', invoices);
}