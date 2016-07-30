"use strict";

const express = require("express");
const app = express();
const db = require("./db");

app.get("/data", (req, res) => {
    if(!req.query.sensorId ||
        (req.query.since && isNaN(Date.parse(req.query.since))) ||
        (req.query.until && isNaN(Date.parse(req.query.until))) ||
        (Date.parse(req.query.since) > Date.parse(req.query.until))){

        res.status(400).send();

    } else {
        var query = db("data").where("sensorId", req.query.sensorId);
        if(req.query.since) {
            query.where("time", ">", req.query.since);
        }
        if(req.query.until) {
            query.where("time", "<", req.query.until);
        }

        query.then((data) => {
            if(data.length == 0) {
                res.status(404).send();
            } else {
                res.status(200).send(data);
            }
        })
    }
});

module.exports = function server() {
    const __server = app;
    return __server;
};
