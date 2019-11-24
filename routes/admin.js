var express = require('express');
var router = express.Router();
var multer = require('multer');
var adminModel = require('../models/adminModel');
var crudModel = require('../models/crudModel')
var utils = require('../services/utils');
var ejs = require('ejs');
var fs = require('fs');

var validatorpackage = require("node-input-validator");

var nodeGeocoder = require("node-geocoder");
var geocoderoptions = require("../external-config/geocoding-config");
var geocoder = nodeGeocoder(geocoderoptions);
var upload = multer();
var areCredentialsWrong = false;

/* amdin routers */
var rentRouter = require('./admin/rent');
var cityRouter = require('./admin/city');
var localityRouter = require('./admin/locality');
var stateRouter = require('./admin/state');
var bankRouter = require('./admin/banks');
var amenityRouter = require('./admin/amenities');
var projectTypeRouter = require('./admin/project_type');
var projectSubTypeRouter = require('./admin/project_sub_type');
var propertyTypeRouter = require('./admin/property_type');
var propertySubTypeRouter = require('./admin/property_sub_type');
var contactRouter = require('./admin/contact');
var feedbackRouter = require('./admin/feedback');
var scheduleSiteVisitRouter = require('./admin/schedule_site_visit');
var newsLetterRouter = require('./admin/news_letter');
var testimonialRouter = require('./admin/testimonial');
var partnerRouter = require('./admin/partners');
var newsRouter = require('./admin/news');
var callbackRouter = require('./admin/callback');
var popularAgentsRouter = require('./admin/popular_agents');
var priceTrendsRouter = require('./admin/price_trends');
var servicesRequestsRouter = require('./admin/service_requests');
var loansRequestsRouter = require('./admin/loan_requests');
var postRequirementRouter = require('./admin/post_requirement');
var stampDutyRouter = require('./admin/stamp_duty');
var projectVideosRouter = require('./admin/project_video');
var homeAdsRouter = require('./admin/home_ads');
var homeSlidesRouter = require('./admin/home_slides');
var enquiryRouter = require('./admin/enquiry');
var sendMailsRouter = require('./admin/send_mails');
var mailTemplatesRouter = require('./admin/mail_templates');
var listPropertyRouter = require('./admin/list_property');
var projectRouter = require('./admin/project');


router.use(function (req, res, next) {
    if (req.session.isAdminLoggedIn) {
        if (req.originalUrl == "/admin/login") {
            res.redirect('/admin')
        } else {
            next();
        }
    } else {
        if (req.originalUrl != "/admin/login") {
            res.redirect('/admin/login')
        } else {
            next();
        }
    }
});
router.use('/rent', rentRouter);
router.use('/city', cityRouter);
router.use('/locality', localityRouter);
router.use('/state', stateRouter);
router.use('/banks', bankRouter);
router.use('/amenity', amenityRouter);
router.use('/project_type', projectTypeRouter);
router.use('/project_sub_type', projectSubTypeRouter);
router.use('/property_type', propertyTypeRouter);
router.use('/property_sub_type', propertySubTypeRouter);
router.use('/contact', contactRouter);
router.use('/feedback', feedbackRouter);
router.use('/schedule_site_visit', scheduleSiteVisitRouter);
router.use('/news_letter', newsLetterRouter);
router.use('/testimonial', testimonialRouter);
router.use('/partners', partnerRouter);
router.use('/news', newsRouter);
router.use('/call_back', callbackRouter);
router.use('/popular_agents', popularAgentsRouter);
router.use('/price_trends', priceTrendsRouter);
router.use('/services_requests', servicesRequestsRouter);
router.use('/loans', loansRequestsRouter);
router.use('/post_requirement', postRequirementRouter);
router.use('/stamp_duty', stampDutyRouter);
router.use('/project_videos', projectVideosRouter);
router.use('/home_ads', homeAdsRouter);
router.use('/home_slide', homeSlidesRouter);
router.use('/enquiry', enquiryRouter);
router.use('/send_mails', sendMailsRouter);
router.use('/mailer', mailTemplatesRouter);
router.use('/list_property', listPropertyRouter);
router.use('/projects', projectRouter);

/* GET users listing. */
router.get('/', async function (req, res) {
    var responseVariable = {
        page_name: 'index',
        page_title: 'Dashboard',
        properties_count: 0,
        projects_search_count: 0,
        rent_count: await crudModel.getRentCount() || 0,
        post_requirement_count: await crudModel.getPostRequirementCount() || 0
    }
    var response = await crudModel.getPropertiesCount();
    if (res.success) {
        responseVariable.properties_count = response.data;
    }
    var response = await crudModel.getProjectsSearchCount();
    if (res.success) {
        responseVariable.projects_search_count = response.data;
    }

    res.render("admin/index", responseVariable);
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
router.post("/login", upload.none(), async function (req, res) {
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

//Project Routes Start Here

router.get('/send_mail', function (req, res) {
    var fileName = req.query.fileName;
    if (!fileName) {
        res.status(400).send({success: false, message: 'file name is invalid'});
    } else {
        res.end({success: true, data: utils.getTemplateForMail(fileName, req.query)});
    }
});

module.exports = router;
