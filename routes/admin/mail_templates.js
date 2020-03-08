var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var { Validator } = require("node-input-validator");
var deepclone = require('lodash.clonedeep');
var utils = require('../../services/utils');
var email = require('../../services/email');
var crudModel = require('../../models/crudModel');
router.get('/', function (req, res) {
    var data = {
        page_name: 'mailer',
        page_title: 'Mailer'
    };
    res.render('admin/mail_templates', data);
});
router.post('/send', upload.single('image'), async function (req, res) {
    let validator = new Validator(req.body, {
        name: "required",
        location: "required",
        sizing: "required",
        price: "required",
        saleable_area: "required",
        rera_id: "required",
        interested_link: "required",
        hightlights: "required",
        amenities1: "required",
        subject: "required"
    });
    var validatorResult = await validator.check();
    if (!validatorResult) {
        var errorMsg = utils.getErrorMessage(validator.errors);
        res.send({ success: false, message: errorMsg });
        res.end();
    } else if (!req.file) {
        res.send({ success: false, message: "Please Provide Image" });
    } else {
        var data = deepclone(req.body);
        data.url = "data:" + req.file.mimetype + ";base64," + req.file.buffer.toString('base64');
        var amenitiesList = await crudModel.getAmenityNames(data.amenities1.toString());
        if (amenitiesList.success) {
            data.amenities = amenitiesList.data;
        }
        data.hightlights = data.hightlights.toString().slice(1);
        var response = utils.getTemplateForMail("final_mailer.ejs", data);
        email.sendMail("", response);
        res.send({ success: true, data: "Mail Sent Successfully" });
    }
});
router.post('/preview', upload.single('image'), async function (req, res) {
    let validator = new Validator(req.body, {
        name: "required",
        location: "required",
        sizing: "required",
        price: "required",
        saleable_area: "required",
        rera_id: "required",
        interested_link: "required",
        hightlights: "required",
        amenities1: "required",
        subject: "required"
    });
    var validatorResult = await validator.check();
    if (!validatorResult) {
        var errorMsg = utils.getErrorMessage(validator.errors);
        res.send({ success: false, message: errorMsg });
        res.end();
    } else if (!req.file) {
        res.send({ success: false, message: "Please Provide Image" });
    } else {
        var data = deepclone(req.body);
        data.url = "data:" + req.file.mimetype + ";base64," + req.file.buffer.toString('base64');
        var amenitiesList = await crudModel.getAmenityNames(data.amenities1.toString());
        if (amenitiesList.success) {
            data.amenities = amenitiesList.data;
        }
        data.hightlights = data.hightlights.toString().slice(1);
        var response = utils.getTemplateForMail("final_mailer.ejs", data);
        res.send({ success: true, data: response });
    }
});
module.exports = router;