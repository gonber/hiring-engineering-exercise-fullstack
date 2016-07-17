# Converge Hiring Exercise for Full Stack Engineering

This exercise is designed to test your ability to design and implement a basic
data-ingestion server in `node.js`.

## Background

The Converge Platform ingests sensor data from our customers' sites (these could be
construction sites, factories, oil wells, etc.), does some processing (including
alerting users for anomalous values) on them, and stores them, allowing them to
be served from an HTTP API. This exercise will see you building a basic version
of the infrastructure required to do this.

Sensor data will come in as JSON representations with the following format:

    {
        sensorId: string,
        time:     int,
        value:    float,
    }

The `sensorId` uniquely identifies different sensors in the field, and all pairs
of `(sensorId, time)` should be unique, as no sensor should be producing two
data for the same moment in time.

In this exercise, sensors will report their data by making an HTTP request `PUT
/data` to a server you will build.

## Specification

The specification for two resources on the HTTP server is described by the tests
in `test/server.spec.js`. They are reproduced below:

### Retrieving data

    GET /data

Fetches data for a given `sensorId`. Can specify date range if desired. Returns
a JSON array of data with the earliest datum first.

* 400s if sensorId is not specified
* 400s if since is not a valid ISO 8601 date
* 400s if until is not a valid ISO 8601 date
* 400s if until is before since
* 404s if that sensorId does not correspond to any data
* returns a json array of data for a given sensor
* returns data after a given date if specified
* returns data before a given date if specified

### Ingesting data

    PUT /data

Inserts a datum into the database. Packet should be sent in the request body as JSON:

    {
        sensorId: string,
        time:     int,
        value:    float,
    }

* 400s if packet does not contain sensorId
* 400s if packet does not contain time
* 400s if packet does not contain value
* 409s if the packet is a duplicate with a different value
* 204s if the packet structure is valid
* stores a valid packet in the database

## Additional features

The data coming in are from temperature sensors, but sometimes these sensors
fail, giving anomalous readings (or, sometimes, they will measure something
unusually hot). This sort of anomalous behaviour should trigger email alerts
notifying the user.

## Project Skeleton

A simple makefile has been included for your convenience, as has a small amount
of boilerplate code. It should all be fairly self-explanatory.

## Questions etc.

I am always happy to answer any questions you may have. Please email me at
<gideon@converge.io> if you need anything clarified.
