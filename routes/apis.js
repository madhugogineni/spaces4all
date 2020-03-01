var express = require("express");
var router = express.Router();
var crudModel = require("../models/crudModel");
var validatorpackage = require("node-input-validator");
var moment = require("moment");
var mailservice = require("../services/email");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
var deepclone = require('lodash.clonedeep');
var multer = require('multer');
var upload = multer();

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
    if (query.property_id) {
        crudModel.addPropertyCallback(query.property_id, query.name, query.phone).then(function (response) {
            if (response.success) {
                var body = "Spaces4all - " + query.name + " Has Requested For Call Back Of Property : spaces4all.com <br><br> " +
                    "<table border='1px'>" +
                    "<tr><td width='100px'>Name</td><td>" + query.name + "</td></tr>" +
                    "<tr><td>Phone</td><td>" + query.phone + "</td></tr>" +
                    "</table>";
                var subject = "Spaces4all - Request For Call Back";
                mailservice.sendMail(subject, body);
                res.send("<h5>Details Sent Successfully !</h5><p>With pleasure, we shall revert shortly.</p><br/>");
            } else {
                res.send("<h5>Details Sending Failed ! Please Try Again.</h5><br>");
            }

        });
    } else {
        res.send("<h5>Details Sending Failed ! Please Try Again.</h5><br>");
    }

});
router.get("/add_project_call_back", function (req, res) {
    var query = req.query;
    crudModel.addProjectCallback(query.project_id, query.name, query.phone).then(function (response) {
        if (response.success) {
            var subject = "Spaces4all - Request For Call Back";
            var body = "Spaces4all - " + query.name + " Has Requested For Call Back Of Property : spaces4all.com <br><br> " +
                "<table border='1px'>" +
                "<tr><td width='100px'>Name</td><td>" + query.name + "</td></tr>" +
                "<tr><td>Phone</td><td>" + query.phone + "</td></tr>" +
                "</table>"
            mailservice.sendMail(subject, body);
            res.send("<h5>Details Sent Successfully !</h5><p>With pleasure, we shall revert shortly.</p><br/>");
        } else {
            res.send("<h5>Details Sending Failed ! Please Try Again.</h5><br>");
        }

    });
});
router.get("/get_amenities", function (req, res) {
    crudModel.getAmenities().then(function (response) {
        res.send(response);
    })
});
router.get("/get_banks", function (req, res) {
    crudModel.getBanks().then(function (response) {
        res.send(response);
    })
})
router.get("/get_property_sub_types", function (req, res) {
    crudModel.getPropertySubTypeByProperty(req.query.property_type).then(function (response) {
        res.send(response);
    });
});

router.get("/get_project_sub_types", function (req, res) {
    crudModel.getProjectSubTypeByProject(req.query.project_type).then(function (response) {
        res.send(response);
    });
});
router.get('/get_states', function (req, res) {
    crudModel.getStates().then(function (response) {
        res.send(response);
    });
});
router.get('/get_property_subtype_using_property_type', function (req, res) {
    // console.log(req.query);
});
router.post("/property_enquiry/:property_id", upload.none(), async function (req, res) {
    let validator = new validatorpackage(req.body, {
        name: "required|minLength:3",
        email: "required|email",
        phone: "required|numeric|maxLength:12|minLength:10",
        comments: "required|minLength:10"
    });
    var validationResult = await validator.check();
    if (validationResult) {
        var data = {
            phone: req.body.phone,
            email: req.body.email,
            name: req.body.name,
            comments: req.body.comments,
            property_id: req.params.property_id,
            datetime: moment().format(dateFormat)
        }
        var insertResponse = await crudModel.insertPropertyEnquiry(data);
        if (insertResponse.success) {
            var subject = "Spaces4all - Property Enquiry";
            var html = "Spaces4all - " + data.name + " has enquired regarding property : " + "https://spaces4all.com/home/property_details/" + data.property_id + " <br><br> " +
                "<table border='1px'>" +
                "<tr><td width='100px'>Name</td><td>" + data.name + "</td></tr>" +
                "<tr><td>Email</td><td>" + data.email + "</td></tr>" +
                "<tr><td>Phone</td><td>" + data.phone + "</td></tr>" +
                "<tr><td>Comments</td><td>" + data.comments + "</td></tr>" +
                "</table>";
            mailservice.sendMail(subject, html);
            res.send({ success: true, message: "Thank you for the details. We have the pleasure to contact you soon.!" })
        } else {
            res.send({ success: false, message: "Something went wrong! Please Try again Later" });
        }
    } else {
        var errorMsg = "";
        Object.keys(validator.errors).map(function (key) {
            errorMsg += validator.errors[key].message + "<br/>";
        });
        res.send({ success: false, message: errorMsg });
    }
});
router.post("/project_enquiry/:project_id", upload.none(), async function (req, res) {
    if (req.params.project_id) {
        let validator = new validatorpackage(req.body, {
            name: "required|minLength:3",
            email: "required|email",
            phone: "required|numeric|maxLength:12|minLength:10",
            comments: "required|minLength:10"
        });
        var validationResult = await validator.check();
        if (validationResult) {
            var data = deepclone(req.body);
            data.project_id = req.params.project_id;
            data.datetime = moment().format(dateFormat);
            var insertResponse = await crudModel.insertProjectEnquiry(data);
            if (insertResponse.success) {
                var subject = "Spaces4all - Project Enquiry";
                var html = "Spaces4all - " + data.name + " has enquired regarding project : " + "https://spaces4all.com/home/project_details/" + data.project_id + " <br><br> " +
                    "<table border='1px'>" +
                    "<tr><td width='100px'>Name</td><td>" + data.name + "</td></tr>" +
                    "<tr><td>Email</td><td>" + data.email + "</td></tr>" +
                    "<tr><td>Phone</td><td>" + data.phone + "</td></tr>" +
                    "<tr><td>Comments</td><td>" + data.comments + "</td></tr>" +
                    "</table>";
                mailservice.sendMail(subject, html);
                res.send({
                    success: true,
                    message: "Thank you for the details. We have the pleasure to contact you soon.!"
                })
            } else {
                res.send({ success: false, message: "Something went wrong! Please Try again Later" });
            }
        } else {
            var errorMsg = "";
            Object.keys(validator.errors).map(function (key) {
                errorMsg += validator.errors[key].message + "<br/>";
            });
            res.send({ success: false, message: errorMsg });
        }
    }
});
module.exports = router;