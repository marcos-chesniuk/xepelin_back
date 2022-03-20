const pgPromise = require('pg-promise')({
    capSQL: true
});

const cn = {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    max: 30 // use up to 30 connections
};

const pgpDb = pgPromise(cn);

// Exporting the database object for shared use:
module.exports = pgpDb;
