import { ColumnSet } from 'pg-promise';
import { CsOptions } from '../utils/interfaces/pg-promise';
const pgPromise = require('pg-promise')({
    capSQL: true
});

const ssl = {
    rejectUnauthorized: false
};

const cn = {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    max: 30, // use up to 30 connections
    ssl: process.env.NODE_ENV === 'development' ? false : ssl
};

const pgpDb = pgPromise(cn);

const generateCS = (columns: Array<String>, options: CsOptions): ColumnSet => {
    return new pgPromise.helpers.ColumnSet(columns, options);
};

const insertWithCs = (values: Array<any>, cs: ColumnSet) => {
    return pgPromise.helpers.insert(values, cs);
};

const insertConflictUpdate = (insertData: Array<any>, cs: ColumnSet, columnsToSkip: Array<string>): void => {
    const query = pgPromise.helpers.insert(insertData, cs) +
        " ON CONFLICT ON CONSTRAINT invoices_un DO UPDATE SET " +
        cs.assignColumns({ from: 'EXCLUDED', skip: columnsToSkip});
    
    pgpDb.none(query).then(() => {
        console.log('DONE')
    }).catch(error => {
        console.log('ERROR')
        console.log(error)
    })
};

// Exporting the database object for shared use:
module.exports = {
    pgpDb,
    generateCS,
    insertWithCs,
    insertConflictUpdate
};
