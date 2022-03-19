const clients = require('./clients');

module.exports = app => {
    app.get('/', (req, res) => {
        res.send('Test OK!');
    });
    
    app.use('/clients', clients);
}