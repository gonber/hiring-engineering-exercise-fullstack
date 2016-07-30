"use strict";

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const db = require("./db");

app.use(bodyParser.json());

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

app.put("/data", (req, res) => {
    if(!req.body.sensorId || !req.body.time || !req.body.value){
        res.status(400).send();
    } else {
        db("data").insert([{
            sensorId: (req.body.sensorId),
            time: (new Date(req.body.time * 1000)),
            value: (req.body.value)
        }]).then(() => {
            res.status(204).send()
        }).catch(() => {
            res.status(409).send();
        })

    }
})

module.exports = function server() {
    const __server = app;
    return __server;
};
