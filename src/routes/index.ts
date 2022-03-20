import { Response } from "express";
const clients = require('./clients');

module.exports = app => {
    app.get('/', (req: any, res: Response) => {
        res.send('Test OK!');
    });
    
    app.use('/clients', clients);
}