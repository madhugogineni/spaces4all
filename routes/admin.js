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
var isAddErrorPresent = false;
var shouldBeConsidered = false;

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
router.use('/mail_templates', mailTemplatesRouter);
router.use('/list_property', listPropertyRouter);
router.use('/projects', projectRouter);

/* GET users listing. */
router.get('/', async function (req, res) {

    var responseVariable = {
        page_name: 'index',
        page_title: 'Dashboard',
        properties_count: await crudModel.getPropertiesCount() || 0,
        projects_search_count: await crudModel.getProjectsSearchCount() || 0,
        rent_count: await crudModel.getRentCount() || 0,
        post_requirement_count: await crudModel.getPostRequirementCount() || 0
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

router.get('/projects', async function (req, res) {
    var data = {
        page_name: 'project',
        page_title: 'Projects',
        shouldBeConsidered: shouldBeConsidered
    };
    if (shouldBeConsidered) {
        data.isError = isAddErrorPresent;
    }
    var projectsResponse = await crudModel.getProjects()
    if (projectsResponse.success) {
        data.projects = projectsResponse.data
        data.projects.forEach((project, index) => {
            var formattedPrice = utils.getPrice({min_price: project.min_price, max_price: project.max_price}, true)
            data.projects[index].min_price_formatted = formattedPrice.min_price
            data.projects[index].max_price_formatted = formattedPrice.max_price
        });
    } else {
        data.projects = []
    }

    res.render('admin/projects', data);

    isAddErrorPresent = false;
    shouldBeConsidered = false;
});

router.get('/exclusive_project/:value/:project_id', function (req, res) {
    var value = req.params.value, projectId = req.params.project_id
    if (value == 'undefined' || value == null) {
        value = 0;
    }
    if (projectId) {
        crudModel.updateColumnInProjects('exclusive', value, projectId)
    }
    res.redirect('/admin/projects');
});
router.get('/project_status/:value/:project_id', function (req, res) {
    var value = req.params.value, projectId = req.params.project_id
    if (value == 'undefined' || value == null) {
        value = 0;
    }
    if (projectId) {
        crudModel.updateColumnInProjects('project_status', value, projectId)
    }
    res.redirect('/admin/projects');
});
router.get('/featured_projects/:value/:project_id', function (req, res) {
    var value = req.params.value, projectId = req.params.project_id
    if (value == 'undefined' || value == null) {
        value = 0;
    }
    if (projectId) {
        crudModel.updateColumnInProjects('featured_projects', value, projectId)
    }
    res.redirect('/admin/projects');
});

router.get('/delete_project/:project_id', async function (req, res) {
    var projectId = req.params.project_id;
    if (projectId) {
        await crudModel.deleteProject(projectId)
    }
    res.redirect('/admin/projects')
});
router.get('/project_details/:project_id?', async function (req, res) {
    var projectId = req.params.project_id;
    if (projectId != '' && projectId != null && projectId != undefined) {
        var projectResponse = await crudModel.getProjectById(projectId);
        if (projectResponse.success) {
            projectResponse.data.quoted_price = utils.getPrice(projectResponse.data.quoted_price, false);
            var amenitiesList = await crudModel.getAmenityNames(projectResponse.data.amenities);
            if (amenitiesList.success) {
                projectResponse.data.amenities_list = amenitiesList.data;
            } else {
                projectResponse.data.amenities_list = [];
            }
            var banksList = await crudModel.getBanksById(projectResponse.data.approved_banks);
            if (banksList.success) {
                projectResponse.data.banks_list = banksList.data;
            } else {
                projectResponse.data.banks_list = []
            }
            res.send(projectResponse)
        } else {
            res.send({success: false});
        }
    } else {
        res.send({success: false});
    }
});
router.get('/project_configurations/:project_id', async function (req, res) {
    var projectId = req.params.project_id;
    var data = {
        page_name: 'project_configurations',
        page_title: 'Project Configurations',
        project_id: projectId
    };
    var configurationsResponse = await crudModel.getProjectConfigurations(projectId);
    configurationsResponse.success ? data.configurations = configurationsResponse.data : data.configurations = []

    res.render('admin/project_configuration', data)
})

router.get('/delete_project_configurations/:project_id/:configuration_id', async function (req, res) {
    var projectId = req.params.project_id, configurationId = req.params.configuration_id;
    await crudModel.deleteProjectConfiguration(configurationId);
    res.redirect('/admin/project_configurations/' + projectId);
})
router.post('/edit_project_configurations/:project_id', upload.none(), async function (req, res) {
    var projectId = req.params.project_id
    if (projectId) {
        var plan = req.body.plan || "",
            size = req.body.size || "",
            price = req.body.price || "",
            configurationId = req.body.configuration_id;
        if (configurationId) {
            await crudModel.updateProjectConfigurations({
                plan: plan,
                size: size,
                price: price
            }, configurationId)
        }
    }
    res.redirect('/admin/project_configurations/' + projectId);
})
router.post('/add_project_configurations/:project_id', upload.none(), async function (req, res) {
    var projectId = req.params.project_id;
    if (projectId) {
        var plan = req.body.plan || "",
            size = req.body.size || "",
            price = req.body.price || "";
        await crudModel.updateProjectConfigurations({
            plan: plan,
            size: size,
            price: price,
            project_id: projectId
        })
    }
    res.redirect('/admin/project_configurations/' + projectId)
})
router.post('/edit_property_possession', upload.none(), async function (req, res) {
    var possessionYear = req.body.possession || '', propertyId = req.body.list_property_id
    if (propertyId) {
        await crudModel.updateColumnInListProperty('possession', possessionYear, propertyId)
    }
    res.redirect('/admin/list_property')
});
router.get('/project/edit/:project_id', async function (req, res) {
    var projectId = req.params.project_id;

    if (projectId) {
        var data = {
            'page_name': 'Edit project',
            'page_title': 'Edit project',
            'project_id': projectId
        };
        var projectResponse = await crudModel.getProjectById(projectId);
        if (projectResponse.success && projectResponse.data) {
            projectResponse.data.quoted_price = utils.getPrice(projectResponse.data.quoted_price, false);
            data.project_details = projectResponse.data
        } else {
            data.project_details = undefined;
        }
        console.log(data.project_details);
        res.render('admin/edit_project', data);
    } else {
        res.redirect('/admin/')
    }

});
router.post('/project/update/:project_id', upload.none(), async function (req, res) {
    var projectId = req.params.project_id;
    if (projectId) {
        var addResponse = await addProject(req, projectId);
        if (addResponse.success) {
            res.send({
                success: true,
                message: "Your Project Updating Successful !"
            });

        } else {
            res.send({
                success: false,
                message: "Your Project Updating Has Failed ! Please Try Again."
            });
        }
    } else {
        res.send({
            success: false,
            message: "Your Project Updating Has Failed ! Please Try Again."
        });
    }
});
router.get('/add_project', function (req, res) {
    res.render('admin/add_project', {page_name: 'add_projects', page_title: 'Add Projects'});
});
router.post('/add_project', upload.none(), async function (req, res) {
    var addProjectResponse = await addProject(req);
    shouldBeConsidered = true;
    if (addProjectResponse.success) {
        isAddErrorPresent = false;
    } else {
        isAddErrorPresent = true;
    }
    res.redirect('/admin/projects');
});
router.get('/send_mail', function (req, res) {
    var fileName = req.query.fileName;
    if (!fileName) {
        res.status(400).send({success: false, message: 'file name is invalid'});
    } else {
        res.end({success: true, data: utils.getTemplateForMail(fileName, req.query)});
    }
});

async function addProject(req, projectId) {
    var projectName = req.body.project_name || "",
        projectType = req.body.project_type || 0,
        projectSubType = req.body.project_sub_type || 0,
        postedBy = req.body.posted_by || "Owner",
        groupName = req.body.group_name || "",
        city = req.body.city || 0,
        locality = req.body.locality || 0,
        status = req.body.status || "Not Available",
        launchDate = req.body.launch_date,
        possessionDate = req.body.possesion_date,
        buildings = req.body.buildings,
        floors = req.body.floors,
        totalArea = req.body.total_area,
        totalUnits = req.body.total_units,
        plans = req.body.plans,
        minBuiltup = req.body.min_builtup,
        maxBuiltup = req.body.max_builtup,
        minPrice = req.body.min_price,
        landMark = req.body.land_mark,
        maxPrice = req.body.max_price,
        maintenance = req.body.maintenance,
        floorRise = req.body.floor_rise,
        commencement = req.body.commencement || "No",
        name = req.body.person_name,
        mobile = req.body.mobile,
        officePhone = req.body.office_phone,
        email = req.body.email,
        specifications = req.body.specifications,
        description = req.body.description,
        banks = req.body.banks,
        amenities = req.body.amenities1,
        banksString = "",
        amenitiesString = "",
        plansString = "";
    if (banks) {
        banksString = banks.toString();
    }
    if (amenities) {
        amenitiesString = amenities.toString();
    }
    if (plans) {
        plansString = plans.toString();
    }
    var city1 = await crudModel.getCityById(city);
    var cityName = ""
    if (city1.success) {
        cityName = city1.data.city;
    }
    var locality1 = await crudModel.getLocalityById(locality);
    var localityName = locality1[0].locality;
    var address = localityName + "," + cityName;
    var geocoderResponse = await geocoder.geocode(address, function (
        err,
        res
    ) {
        return res;
    });
    var latitude = geocoderResponse[0].latitude,
        longitude = geocoderResponse[0].longitude;
    var addProjectResponse = await crudModel.addProject({
        'project_name': projectName,
        'project_type': projectType,
        'project_sub_type': projectSubType,
        'posted_by': postedBy,
        'group_name': groupName,
        'city': city,
        'locality': locality,
        'status': status,
        'launch_date': launchDate,
        'possesion_date': possessionDate,
        'no_of_buildings': buildings,
        'no_of_floors': floors,
        'total_area': totalArea,
        'total_units': totalUnits,
        'plans': plansString,
        'land_mark': landMark,
        'min_builtup_area': minBuiltup,
        'max_builtup_area': maxBuiltup,
        'min_price': minPrice,
        'max_price': maxPrice,
        'maintenance_charge': maintenance,
        'floor_rise': floorRise,
        'commencement': commencement,
        'name': name,
        'mobile': mobile,
        'office_phone': officePhone,
        'email': email,
        'description': description,
        'specifications': specifications,
        'approved_banks': banksString,
        'amenities': amenitiesString,
        'longitude': longitude,
        'latitude': latitude
    }, projectId);
    return addProjectResponse;
}

module.exports = router;
