const xml2js = require('xml2js');
const fs = require('fs');
var myData = [];

const parser = new xml2js.Parser();

fs.readFile(__dirname + '/data.kml', function (err, data) {
    if (err) {
        console.log("Storing data in database failed.Try again.");
    } else {
        parser.parseString(data, function (err, result) {
            if (err) {
                console.log("Stroing data in database failed.Try again.");
            } else {
                const data = result.kml.Document[0].Placemark.map(res => {
                    myData.push({
                        name: res.name[0],
                        point: res['Point'] ? true : false,
                        pointCoordinates: res['Point'] ? res['Point'][0]['coordinates'][0].split('\n')[1].trim() : "",
                        polygonCoordinates: res['Polygon'] ? res['Polygon'][0]['outerBoundaryIs'][0]['LinearRing'][0]['coordinates'][0].split('\n') : []
                    });
                });
            }
        });
    }
});