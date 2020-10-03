require('dotenv').config();
const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const xml2js = require('xml2js');
const fs = require('fs');
const routes = require('./routes/index');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

global.myData = [];

const parser = new xml2js.Parser();

fs.readFile(__dirname + '/data.kml', function (err, data) {
    if (err) {
        console.log("Stroing data in database failed.Try again.");
    } else {
        parser.parseString(data, function (err, result) {
            if (err) {
                console.log("Stroing data in database failed.Try again.");
            } else {
                myData = result.kml.Document[0].Placemark.map(res => {
                    return {
                        name: res.name[0],
                        point: res['Point'] ? true : false,
                        pointCoordinates: res['Point'] ? res['Point'][0]['coordinates'][0].split('\n')[1].trim() : "",
                        polygonCoordinates: res['Polygon'] ? res['Polygon'][0]['outerBoundaryIs'][0]['LinearRing'][0]['coordinates'][0].split('\n') : []
                    };
                });
                console.log(" myData :", myData);
            }
        });
    }
});

app.use('/api', routes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log('Server is listening on the port :', PORT);
});