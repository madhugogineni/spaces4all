var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var validatorpackage = require("node-input-validator");
var deepclone = require('lodash.clonedeep');
var utils = require('../../services/utils')
router.get('/', function (req, res) {
    var data = {
        page_name: 'mailer',
        page_title: 'Mailer'
    };
    res.render('admin/mail_templates', data);
});
router.get('/send', function (req, res) {

});
router.post('/preview', upload.single('image'), async function (req, res) {
    // res.send(req.body);
    // res.send(req.file);
    let validator = new validatorpackage(req.body, {
        name: "required",
        location: "required",
        sizing: "required",
        price: "required",
        saleable_area: "required",
        rera_id: "required",
        interested_link: "required",
        hightlights: "required",
        amenities1: "required"
    });
    var validatorResult = await validator.check();
    if (!validatorResult) {
        var errorMsg = utils.getErrorMessage(validator.errors);
        res.send({success: false, message: errorMsg});
        res.end();
    } else if (!req.file) {
        res.send({success: false, message: "Please Provide Image"});
    } else {
        var data = deepclone(req.body);
        data.url = "data:image/jpg;base64" + req.file.buffer;
        var response = utils.getTemplateForMail("final_mailer.ejs", data);
        res.send('welcome');
    }
});
module.exports = router;