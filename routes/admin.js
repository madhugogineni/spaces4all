var express = require('express');
var router = express.Router();
var multer = require('multer');
var adminModel = require('../models/adminModel');
var upload = multer();
var areCredentialsWrong = false;

/* GET users listing. */
router.get('/', function (req, res) {

    if (req.session.isAdminLoggedIn) {
        res.render("admin/index", {page_name: 'index', page_title: 'Dashboard'});
    } else {
        res.redirect("login");
    }

});
router.get("/login", function (req, res) {
    var data = {page_name: 'Login', page_title: 'Login'};
    if (req.session.isAdminLoggedIn) {
        res.redirect("/admin");
    } else {
        data.wrong_credentials = areCredentialsWrong;
        res.render("admin/login", data);
    }
});
router.post("/validate_login", upload.none(), async function (req, res) {
    console.log(req.body);
    var email = req.body.email || "";
    var password = req.body.password || "";
    var userCountResponse = await adminModel.getUserCount({email: email, password: password});
    if (userCountResponse.success) {
        if (userCountResponse.count > 0) {
            req.session.isAdminLoggedIn = true;
            res.redirect("/admin");
        } else {
            areCredentialsWrong = true;
            res.redirect("login");
        }
    } else {
        res.send("Welcome");
    }
});

module.exports = router;
