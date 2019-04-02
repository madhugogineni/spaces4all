var express = require("express");
var router = express.Router();
var crudModel = require("../models/crudModel");

router.get("/calculate_stamp_duty", function (req, res) {
    var id = req.query.id;
    var propertyValue = req.query.propertyValue;
    crudModel.getStampDutyById(id).then(function (response) {
        var percentage = response[0].percentage;
        var stampDuty = propertyValue * percentage / 100;
        res.end("" + stampDuty);
    });
});
router.get("/get_home_slider", function (req, res) {
    crudModel.getHomeSlide().then(function (response) {
        res.send(response);
    });
});
router.get("/get_property_types", function (req, res) {
    crudModel.getPropertyType().then(function (response) {
        res.send(response);
    });
});
router.get("/get_project_types", function (req, res) {
    crudModel.getProjectType().then(function (response) {
        res.send(response);
    });
});
router.get("/get_cities", function (req, res) {
    crudModel.getCity().then(function (response) {
        res.send(response);
    });
});
router.get("/get_localities", function (req, res) {
    console.log(req.query.city_id);
    crudModel.getLocalityByCity(req.query.city_id).then(function (response) {
        res.send(response);
    });
});
module.exports = router;