var express = require('express');
var router = express.Router();
var multer = require('multer');
var adminModel = require('../models/adminModel');
var upload = multer();

/* GET users listing. */
router.get('/', function (req, res) {

    if (req.session.isAdminLoggedIn) {
        res.render("admin/index", {});
    } else {
        res.redirect("login");
    }

});
router.get("/login", function (req, res) {
    if (req.session.isAdminLoggedIn) {
        res.redirect("/admin");
    } else {
        res.render("admin/login", {page_name: 'Login', page_title: 'Login'});
    }
});
router.post("/validate_login", upload.none(), async function (req, res) {
    console.log(req.body);
    var email = req.body.email || "";
    var password = req.body.password || "";
    var userCountResponse = await adminModel.getUserCount({email: email, password: password});
    if (userCountResponse.success) {
        if (userCountResponse.count > 0) {
            res.session.isAdminLoggedIn = true;
        } else {
            res.send("invalid credentials");
        }
    } else {
        res.send("Welcome");
    }
});

module.exports = router;
