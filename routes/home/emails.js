var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer();
var emailsModel = require('../../models/emails')
var validation = require('../../services/validation');
var deepclone = require('lodash.clonedeep');
var Constants = require('../../services/constants')


router.get("/unsubscribe", function (req, res) {
    var data = {
        page_name: 'Unsubscribe',
        page_title: 'Unsubscribe'
    }
    res.render("home/emails/unsubscribe", data);
});

router.post("/unsubscribe", upload.none(), async function (req, res) {
    var body = deepclone(req.body);
    if (!body.email) {
        res.send({ success: false, message: "Email Id missing" })
    }
    var validationResponse = await validation.validate(body, { email: "required|email" })

    if (!validationResponse) {
        res.send({ success: false, message: validationResponse.message })
    }

    body.status = Constants.EMAIL_UNSUB
    var emailResponse = await emailsModel.insertEmail(body)
    if (!emailResponse.success) {
        res.send({ success: false, message: "Some error occured. Please try again" });
    }

    res.send({ success: true, message: "Successfully unsubscribed" })
})
module.exports = router