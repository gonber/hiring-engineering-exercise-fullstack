/* eslint-env mocha */

"use strict";

const supertest = require("supertest");
const { expect } = require("chai");
const db = require("../db");

// TODO: make sure this imports your HTTP server as per the supertest docs
const server = require("../server");

describe("HTTP Server", () => {
    let app, request;

    before(() => app = server());
    before(() => request = supertest(app));
    beforeEach(db.clean);

    describe("GET /data", () => {
        const URL = "/data";
        it("400s if sensorId is not specified", (done) => {
            request.get(URL)
            .expect(400)
            .end(done);
        });

        it("400s if since is not a valid ISO 8601 date", (done) => {
            request.get(`${URL}?sensorId=1&since=invalid-date`)
            .expect(400)
            .end(done);
        });

        it("400s if until is not a valid ISO 8601 date", (done) => {
            request.get(`${URL}?sensorId=1&until=invalid-date`)
            .expect(400)
            .end(done);
        });

        it("400s if until is before since", (done) => {
            const since = "2016-01-02";
            const until = "2016-01-01";

            request.get(`${URL}?sensorId=1&since=${since}&until=${until}`)
            .expect(400)
            .end(done);
        });

        it("404s if that sensorId does not correspond to any data", (done) => {
            request.get(`${URL}?sensorId=1`)
            .expect(404)
            .end(done);
        });

        it("returns a json array of data for a given sensor", (done) => {
            const sensorId = 1;
            const dataArray = [
                { time: new Date("2016-01-01T01:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T02:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T03:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T04:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T05:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T06:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T07:00:00Z"), value: Math.random() * 100 },
            ].map((datum) => Object.assign({ sensorId }, datum));

            db("data").insert(dataArray).then(() => {
                request.get(`${URL}?sensorId=${sensorId}`)
                .expect(200)
                .expect(({ body }) => {
                    expect(body).to.be.an("array");
                    expect(body).to.have.length(dataArray.length);
                    expect(body).to.deep.equal(dataArray);
                })
                .end(done);
            });
        });

        it("returns data after a given date if specified", (done) => {
            const sensorId = 1;
            const dataArray = [
                { time: new Date("2016-01-01T01:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T02:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T03:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T04:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T05:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T06:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T07:00:00Z"), value: Math.random() * 100 },
            ].map((datum) => Object.assign({ sensorId }, datum));

            db("data").insert(dataArray).then(() => {
                const u = `${URL}?sensorId=${sensorId}&since=${dataArray[2].time.toISOString()}`;
                request.get(u)
                .expect(200)
                .expect(({ body }) => {
                    expect(body).to.be.an("array");
                    expect(body).to.have.length(dataArray.length - 3);
                    expect(body).to.deep.equal(dataArray.slice(2));
                })
                .end(done);
            });
        });

        it("returns data before a given date if specified", (done) => {
            const sensorId = 1;
            const dataArray = [
                { time: new Date("2016-01-01T01:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T02:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T03:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T04:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T05:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T06:00:00Z"), value: Math.random() * 100 },
                { time: new Date("2016-01-01T07:00:00Z"), value: Math.random() * 100 },
            ].map((datum) => Object.assign({ sensorId }, datum));

            db("data").insert(dataArray).then(() => {
                const u = `${URL}?sensorId=${sensorId}&until=${dataArray[3].time.toISOString()}`;
                request.get(u)
                .expect(200)
                .expect(({ body }) => {
                    expect(body).to.be.an("array");
                    expect(body).to.have.length(3);
                    expect(body).to.deep.equal(dataArray.slice(0, 3));
                })
                .end(done);
            });
        });
    });

    describe("PUT /data", () => {
        const URL = "/data";
        it("400s if the packet structure is invalid", (done) => {
            let c = 0;
            const checkDone = () => (c > 2) ? done() : null;

            request.put(URL).send({ time: 1451649600, value: 10 })
            .expect(400)
            .end((err) => {
                if(err) return done(err);
                c++;
                checkDone();
            });

            request.put(URL).send({ sensorId: 1, time: 1451649600 })
            .expect(400)
            .end((err) => {
                if(err) return done(err);
                c++;
                checkDone();
            });

            request.put(URL).send({ sensorId: 1, value: 10 })
            .expect(400)
            .end((err) => {
                if(err) return done(err);
                c++;
                checkDone();
            });
        });

        it("409s if the packet is a duplicate with a different value", (done) => {
            const sensorId = 1;
            const time = "2016-01-01T01:00:00Z";

            db.insert({ sensorId, time, value: 10 }).then(() => {
                request.put(URL).send({ sensorId, time, value: 20 })
                .expect(409).end(done);
            }).catch(done);
        });

        it("204s if the packet structure is valid", (done) => {
            const packet = { sensorId: 1, time: 1451649600, value: 10 };
            request.put(URL).send(packet).expect(204).end(done);
        });

        it("stores a valid packet in the database", (done) => {
            const packet = { sensorId: 1, time: 1451649600, value: 10 };
            request.put(URL).send(packet).expect(204).end((err) => {
                if(err) return done(err);

                db("data").then((data) => {
                    expect(data).to.have.length(1);
                    expect(data[0]).to.deep.equal(packet);
                }).then(() => done()).catch(done);
            });
        });
    });
});
