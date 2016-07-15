"use strict";

const http = require("http");

module.exports = function server() {
    const __server = http.createServer((req, res) => res.end("Hello World"));
    return __server;
};
