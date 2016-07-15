"use strict";

const db = require("./db");

db.schema.createTableIfNotExists("data", (table) => {
    table.string("sensorId").notNullable();
    table.timestamp("time").notNullable().defaultTo(db.raw("NOW()"));
    table.float("value").notNullable();

    table.primary(["sensorId", "time"]);
}).then(() => process.exit(0)).catch((e) => {
    console.error(e); // eslint-disable-line no-console
    process.exit(-1);
});
