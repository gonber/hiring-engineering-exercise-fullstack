# Converge Hiring Exercise for Full Stack Engineering

This exercise is designed to test your ability to design and implement a basic
data-ingestion server in `node.js`.

Converge ingests sensor data from various locations, does some processing
(including alerting users for anomalous values) on them, and stores them,
allowing them to be served from an HTTP API. This exercise will see you building
a basic version of the infrastructure required to do this.

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
/data` to a server we will build, that listens on port `8080`.

## HTTP Specification

### Ingesting data

    PUT /data

#### Valid input data

    {
        sensorId: string,
        time:     int,
        value:    float,
    }

#### Expected behaviour

Should ensure the packet structure is valid, and store the packet in a database.
If the packet is invalid, it should return a `400 Bad Request` status. If the
packet is valid, and has been successfully stored in the database, it should
return a `204 No Content` status.

### Retrieving data

    GET /data

#### Possible parameters

* `sensorId` only fetch data for the given sensor id **required**;
* `since` only fetch data for times after the given time (should be ISO_8601
  compatible);
* `until` only fetch data for times before the given time (should be ISO_8601
  compatible);

#### Expected behaviour

If the given `sensorId` is not found, it should return `404 Not Found`. If the
date formats for `since` and `until` are invalid, it should return `400 Bad
Request`, and also if `until` is before `since` (which would be an impossible
condition to fulfil). If `sensorId` is not specified, it should return `400 Bad
Request` as `sensorId` is a required parameter.

If all the inputs are valid, and data are found, then it should return `200 OK`
with `Content-Type: application/json` and a valid-json array of data, sorted by
time in *descending* order (i.e. with the earliest datum at index 0).

## Project Skeleton

### Tests

We expect unit tests to be written for your code, and would prefer you to use
`mocha` as your test runner (the script `npm test` is set up to expect tests to
be in the `tests` folder, and to use mocha).

Some end-to-end tests have been written to check that your application adheres
to the specification above, they are in `tests/e2e.spec.js`.

There is a file called `tests/clean_db.js` into which you should place a script
that will clear the database you are using. This is so that each tests can run
on a clean slate.

### Misc

A `package.json` file has been included in this project, with a few things
installed already.

An `.eslintrc` file has been included as well, to make sure your code adheres to
our coding standards (this makes it easier to mark).

`main.js` should be your starting point, and `npm start` is set up to expect
that.

## Questions etc.

I am always happy to answer any questions you may have. Please email me at
<gideon@converge.io> if you need anything clarified.
