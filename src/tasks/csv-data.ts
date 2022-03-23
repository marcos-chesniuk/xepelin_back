const cron = require('node-cron');
const axios = require('axios');
const csvtojson = require('csvtojson');
const db = require('../db/connection');

const getVankInfo = () => {
    console.log('Updating Invoice INFO...');
    axios.get(process.env.CSV_URL, { responseType: 'blob' })
        .then(response => {
            const csvStr = response.data;

            csvtojson().fromString(csvStr).then((data: Array<any>) => {
                if (data.length > 0) {
                    const dataToInsert = translateDates(data);
                    const columns = Object.keys(dataToInsert[0]);
                    const cs = db.generateCS(columns, { table: 'INVOICES' });

                    const columnsToSkip = [
                        'INVOICE_ID',
                        'VENDOR_ID',
                        'INVOICE_NUMBER',
                        'INVOICE_DATE',
                        'INVOICE_TOTAL',
                        'BANK_ID',
                        'INVOICE_DUE_DATE',
                        'CURRENCY'
                    ];

                    db.insertConflictUpdate(dataToInsert, cs, columnsToSkip)
                }
            });
        })
        .catch(error => {
            console.error(`
                Error: Couldn't retrieve CSV file\n
                ${error.response.status} - ${error.response.statusText}
            `);
        });
};

const translateDates = (data: Array<any>): Array<any> => {
    const translatedData = [...data];
    translatedData.map(row => {
        row.INVOICE_DATE = row.INVOICE_DATE ? new Date(row.INVOICE_DATE) : null;
        row.INVOICE_DUE_DATE = row.INVOICE_DUE_DATE ? new Date(row.INVOICE_DUE_DATE) : null;
        row.PAYMENT_DATE = row.PAYMENT_DATE ? new Date(row.PAYMENT_DATE) : null;
        return row;
    });

    return translatedData;
}

module.exports = () => {
    cron.schedule('0 7 * * *', getVankInfo) // Every day at 7:00 AM
}
