const cron = require('node-cron');
const axios = require('axios');
const csvtojson = require('csvtojson');
const db = require('../db/connection');

// cron.schedule('0 0 8 * * *', function() {
//     console.log('Accessing CSV data...');
// });

// cron.schedule('* * * * * *', function() {
//     console.log('running a task every second');
// });

const getVankInfo = () => {
    console.log('Getting info!');
    axios.get('https://gist.githubusercontent.com/rogelio-meza-t/f70a484ec20b8ea43c67f95a58597c29/raw/41f289c605718e923fc1fad0539530e4d0413a90/invoices.csv', { responseType: 'blob' })
        .then(response => {
            const csvStr = response.data;
            csvtojson().fromString(csvStr).then(data => {
                console.log(data)
            });
        })
        .catch(error => {
            console.log(error);
        });
};

module.exports = () => {
    cron.schedule('* * * * *', getVankInfo)
}
