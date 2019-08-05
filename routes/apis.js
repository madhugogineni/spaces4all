var express = require("express");
var router = express.Router();
var crudModel = require("../models/crudModel");
var nodemailer = require("nodemailer");
var emailConfig = require("../external-config/email-config");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailConfig.emailId,
        pass: emailConfig.password
    }
});

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
    crudModel.getLocalityByCity(req.query.city_id).then(function (response) {
        res.send(response);
    });
});
router.get("/add_property_call_back", function (req, res) {
    var query = req.query;
    crudModel.addPropertyCallback(query.property_id, query.name, query.phone).then(function (response) {
        if (response.success) {
            transporter.sendMail({
                to: emailConfig.emailId,
                subject: "Spaces4all - Request For Call Back",
                html: "Spaces4all - " + query.name + " Has Requested For Call Back Of Property : spaces4all.com <br><br> " +
                    "<table border='1px'>" +
                    "<tr><td width='100px'>Name</td><td>" + query.name + "</td></tr>" +
                    "<tr><td>Phone</td><td>" + query.phone + "</td></tr>" +
                    "</table>"
            });
            res.send("<h5>Details Sent Successfully !</h5><p>With pleasure, we shall revert shortly.</p><br/>");
        } else {
            res.send("<h5>Details Sending Failed ! Please Try Again.</h5><br>");
        }

    });
});
router.get("/add_project_call_back", function (req, res) {
    var query = req.query;
    crudModel.addProjectCallback(query.project_id, query.name, query.phone).then(function (response) {
        if (response.success) {
            transporter.sendMail({
                to: emailConfig.emailId,
                subject: "Spaces4all - Request For Call Back",
                html: "Spaces4all - " + query.name + " Has Requested For Call Back Of Property : spaces4all.com <br><br> " +
                    "<table border='1px'>" +
                    "<tr><td width='100px'>Name</td><td>" + query.name + "</td></tr>" +
                    "<tr><td>Phone</td><td>" + query.phone + "</td></tr>" +
                    "</table>"
            });
            res.send("<h5>Details Sent Successfully !</h5><p>With pleasure, we shall revert shortly.</p><br/>");
        } else {
            res.send("<h5>Details Sending Failed ! Please Try Again.</h5><br>");
        }

    });
});
router.get("/get_emenities", function (req, res) {
    crudModel.getAmenities().then(function (response) {
        res.send(response);
    })
});
router.get("/get_property_sub_types", function (req, res) {
    crudModel.getPropertySubTypeByProperty(req.query.property_type).then(function (response) {
        res.send(response);
    });
});
router.get('/get_states', function (req, res) {
    crudModel.getStates().then(function (response) {
        res.send(response);
    });
});
router.get('/get_property_subtype_using_property_type', function (req, res) {
    console.log(req.query);
});
router.get("/property_enquiry/:property_id",function(req,res) {
    console.log(req.params.property_id);
});
module.exports = router;