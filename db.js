"use strict";

const knex = require("knex");

const db = knex({
    client: "pg",
    connection: {
        host: "localhost",
        database: "converge",
        user: "converge",
        password: "converge",
    },
});

module.exports = db;
module.exports.clean = () => db.schema.raw("TRUNCATE data RESTART IDENTITY CASCADE;");
