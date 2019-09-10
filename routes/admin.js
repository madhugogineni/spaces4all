var express = require('express');
var router = express.Router();
var multer = require('multer');
var adminModel = require('../models/adminModel');
var crudModel = require('../models/crudModel')
var utils = require('../services/utils')

var validatorpackage = require("node-input-validator");


var nodeGeocoder = require("node-geocoder");
var geocoderoptions = require("../external-config/geocoding-config");
var geocoder = nodeGeocoder(geocoderoptions);
var upload = multer();
var areCredentialsWrong = false;


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

router.get('/list_property', async function (req, res) {
    var listProperty = await crudModel.getPropertyDetails()
    var responseObject = {
        page_name: 'list_property',
        page_title: 'List Property'
    }
    if (listProperty.success) {
        responseObject.list_property = listProperty.data
    } else {
        responseObject.list_property = []
    }
    res.render('admin/list_property', responseObject);
});

router.get('/status_list_property/:value/:property_id', async function (req, res) {
    var propertyId = req.params.property_id, value = req.params.value;
    var updateResponse = crudModel.updateColumnInListProperty('status', value, propertyId)
    res.redirect('/admin/list_property')
});
router.get('/hot_property/:value/:property_id', async function (req, res) {
    var propertyId = req.params.property_id, value = req.params.value;
    var updateResponse = crudModel.updateColumnInListProperty('hot_property', value, propertyId)
    res.redirect('/admin/list_property')
});
router.get('/latest_property/:value/:property_id', async function (req, res) {
    var propertyId = req.params.property_id, value = req.params.value;
    var updateResponse = crudModel.updateColumnInListProperty('latest_property', value, propertyId)
    res.redirect('/admin/list_property')
});
router.get('/property_details/:property_id', async function (req, res) {
    var propertyId = req.params.property_id;

    if (propertyId != '' && propertyId != null && propertyId != undefined) {
        var propertyResponse = await crudModel.getPropertyDetailsById(propertyId)
        if (propertyResponse.success) {
            propertyResponse.data.quoted_price = utils.getPrice(propertyResponse.data.quoted_price,false);
            var amenitiesList = await crudModel.getAmenityNames(propertyResponse.data.amenities);
            if (amenitiesList.success) {
                propertyResponse.data.amenities_list = amenitiesList.data;
            }
            console.log(propertyResponse)
            res.send(propertyResponse)
        } else {
            res.send({success: false});
        }
    }
});
router.get('/delete_list_property/:property_id', async function (req, res) {
    var propertyId = req.params.property_id;
    if (propertyId) {
        await crudModel.deleteProperty(propertyId)
    }
    res.redirect('/admin/list_property')
});
router.get('/edit_property/:property_id?', async function (req, res) {

    var propertyId = req.params.property_id;
    var invalid = false
    if (propertyId) {
        var propertyResponse = await crudModel.getPropertyDetailsById(propertyId)
        console.log(propertyResponse)
        if (propertyResponse.success) {
            res.render('admin/edit_property', {
                page_name: 'edit_property',
                page_title: 'Edit Property',
                property: propertyResponse.data
            });
        } else {
            invalid = true
        }
    } else {
        invalid = true
    }
    if (invalid) {
        res.redirect('/admin/welcome')
    }
});
router.post('/update_property_details/:property_id?', upload.none(),
    async function (req, res) {
        console.log(req.body)
        var propertyId = req.params.property_id;
        if (propertyId) {
            if (req.body.property_sub_type == 14 || req.body.property_sub_type == 18) {
                console.log(req.body)
                var name = req.body.name || "",
                    email = req.body.email || "",
                    phone = req.body.phone || "",
                    propertyName = req.body.property_name || "",
                    propertyType = req.body.property_type || "",
                    subType = req.body.property_sub_type || "",
                    facing = req.body.facing1 || "",
                    city = req.body.city || "",
                    locality = req.body.locality || "",
                    state = req.body.state || 1,
                    quotedPrice = req.body.quoted_price1 || "",
                    plotArea = req.body.plot_area || "",
                    east = req.body.east || "",
                    west = req.body.west || "",
                    north = req.body.north || "",
                    south = req.body.south || "",
                    floors = req.body.floors || "",
                    openSlides = req.body.open_slides || "",
                    width = req.body.width || "",
                    constructionDone = req.body.construction_done || "",
                    boundaryWall = req.body.boundary_wall || "",
                    gatedColony = req.body.gated_colony || "",
                    description = req.body.description || "",
                    amenities = req.body.amenities || "",
                    postedBy = req.body.posted_by || "Owner";
                let validator = new validatorpackage(req.body, {
                    plot_area: "numeric",
                    quoted_price1: "numeric",
                    width: "numeric",
                    east: "numeric",
                    west: "numeric",
                    north: "numeric",
                    south: "numeric"
                });

                var validatorResult = await validator.check();

                if (!validatorResult) {
                    var validationError = validator.errors;
                    var errorMsg = "";
                    for (var keys in validationError) {
                        errorMsg += validationError[keys].message + "<br/>";
                    }
                    res.send({success: false, message: errorMsg});
                } else {
                    var date = utils.getDate();
                    var city1 = await crudModel.getCityById(city);
                    var cityName = city1[0].city;
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
                    var queryResult = await crudModel.addResidentialPlotToListProperty(
                        name,
                        email,
                        phone,
                        propertyName,
                        propertyType,
                        subType,
                        facing,
                        city,
                        locality,
                        state,
                        quotedPrice,
                        plotArea,
                        floors,
                        description,
                        amenities,
                        postedBy,
                        latitude,
                        longitude,
                        "",
                        0,
                        propertyId
                    );
                    if (queryResult.success) {
                        var propertyId = queryResult.propertyId;
                        var detailsResponse = await crudModel.addResidentialPlotDetails(
                            queryResult.propertyId, {
                                north: north,
                                south: south,
                                east: east,
                                west: west
                            },
                            openSlides,
                            width,
                            constructionDone,
                            boundaryWall,
                            gatedColony,
                            true
                        );
                        if (detailsResponse.success) {
                            res.send({
                                success: true,
                                message: "Thank you for your trust in space4all. Just wait few hours, we are on the job. !"
                            });
                        } else {
                            res.send({
                                success: false,
                                message: "Your Property Listing Has Failed ! Please Try Again."
                            });
                            // removeProperty(propertyId, "14");
                        }
                    } else {
                        res.send({
                            success: false,
                            message: "Your Property Listing Has Failed ! Please Try Again."
                        });
                    }
                }
            } else {
                let validator = new validatorpackage(req.body, {
                    name: "required|minLength:3",
                    email: "required|email",
                    phone: "required|numeric|digits:10",
                    // property_name: "required",
                    property_type: "required",
                    property_sub_type: "required",
                    facing: "required|alpha",
                    city: "required",
                    locality: "required",
                    saleable_area: "required|numeric",
                    posted_by: "required"
                });
                var validatorResult = await validator.check();

                if (!validatorResult) {
                    var validationError = validator.errors;
                    var errorMsg = "";
                    for (var keys in validationError) {
                        errorMsg += validationError[keys].message + "<br/>";
                    }
                    res.send({success: false, message: errorMsg});
                } else {
                    var name = req.body.name || "";
                    var email = req.body.email || "";
                    var phone = req.body.phone || "";
                    var propertyName = req.body.property_name || "";
                    var propertyType = req.body.property_type || "";
                    var subType = req.body.property_sub_type || "";
                    var facing = req.body.facing || "";
                    var bedrooms = req.body.bedrooms || "";
                    var bathrooms = req.body.bathrooms || "";
                    var city = req.body.city || "";
                    var locality = req.body.locality || "";
                    var state = req.body.state || 1;
                    var carParking = req.body.car_parking || "";
                    var quotedPrice = req.body.quoted_price || "";
                    var saleableArea = req.body.saleable_area || "";
                    var age = req.body.construction_age || "";
                    var floorNo = req.body.floor_no || "";
                    var floors = req.body.floors || "";
                    var description = req.body.description || "";
                    var amenities1 = req.body.amenities1 || [];
                    var furnishing = req.body.furnishing || "";
                    var postedBy = req.body.posted_by || "Owner";
                    var amenities = "";
                    for (var i = 0; i < amenities1.length; i++) {
                        amenities += amenities1[i];
                        if (i != amenities1.length - 1) {
                            amenities += ",";
                        }
                    }
                    var date = utils.getDate();
                    var city1 = await crudModel.getCityById(city);
                    var cityName = city1[0].city;
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
                    var queryResult = await crudModel.addListProperty(
                        name,
                        email,
                        phone,
                        propertyName,
                        propertyType,
                        subType,
                        facing,
                        bedrooms,
                        bathrooms,
                        city,
                        locality,
                        state,
                        carParking,
                        quotedPrice,
                        saleableArea,
                        age,
                        floorNo,
                        floors,
                        description,
                        amenities,
                        furnishing,
                        postedBy,
                        latitude,
                        longitude,
                        "",
                        0,
                        propertyId
                    );
                    if (queryResult.success) {
                        res.send({
                            success: true,
                            message: "Thank you for your trust in space4all. Just wait few hours, we are on the job. !"
                        });
                    } else {
                        res.send({
                            success: false,
                            message: "Your Property Listing Has Failed ! Please Try Again."
                        });
                    }
                }
            }
        } else {

        }
    });
router.get('property_photos/:property_id?', async function (req, res) {
    var propertyId = req.params.property_id
    if (propertyId) {
        res.send('welcome')
    } else {
        res.redirect('/admin/')
    }
});


//Project Routes Start Here

router.get('/projects', async function (req, res) {
    var data = {
        page_name: 'project',
        page_title: 'Projects'
    }
    var projectsResponse = await crudModel.getProjects()
    if(projectsResponse.success) {
        data.projects = projectsResponse.data
        data.projects.forEach((project,index) => {
            var formattedPrice = utils.getPrice({min_price: project.min_price, max_price: project.max_price},true)
            data.projects[index].min_price_formatted = formattedPrice.min_price
            data.projects[index].max_price_formatted = formattedPrice.max_price
        });
    }else {
        data.projects = []
    }

    res.render('admin/projects',data)
});

module.exports = router;
