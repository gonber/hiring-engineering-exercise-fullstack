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

## Specification

The expected behaviour is detailed in the tests. Your app should satisfy them.

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
