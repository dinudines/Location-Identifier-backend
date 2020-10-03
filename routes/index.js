const express = require('express');
const router = express.Router();
const axios = require('axios');
const classifyPoint = require("robust-point-in-polygon");
const { GEOCODE_API } = require('../constants');

router.post('/search', async (req, res) => {
    try {
        const placeName = req.body && req.body.placeName;
        const apiKey = process.env.GEOCODE_API_KEY;
        
        if (placeName) {

            const response = await axios.get(`${GEOCODE_API}?q=${placeName}&key=${apiKey}`);``
            
            const lat = response.data.results[0].geometry.lat;
            const lng = response.data.results[0].geometry.lng;

            let outletName = '';

            let result = myData.some((data) => {
                let polygon = data.point ? data.pointCoordinates.split(',') : data.polygonCoordinates;
                
                if (data.point) {
                    polygon = polygon.map(point => {
                        return parseFloat(point);
                    });
                    polygon = polygon.slice(0, polygon.length - 1);
                } else {
                    polygon = polygon.map(point => {
                        if (point) {
                            let temp = point.split(',');
                            temp = temp.map(point => {
                                return parseFloat(point);
                            });
                            temp = temp.slice(0, temp.length - 1);
                            return temp;
                        }
                    });
                    polygon = polygon.slice(1, polygon.length);
                    polygon = polygon.slice(0, polygon.length - 1);
                }

                const result = classifyPoint(polygon, [lat, lng]);

                if (result === -1) {
                    outletName = data.name;
                    return true;
                } else {
                    return false;
                }
            });

           res.json({ status: true, message: "Success", found: result, outletName: outletName });
        } else {
            res.json({ status: false, message: 'Place name is empty.' });
        }
    } catch (e) {
        res.json({ status: false, message: 'Something went wrong.Please try after sometime.' });
    }
});

module.exports = router;
