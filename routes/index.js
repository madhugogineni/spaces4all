var express = require("express");
var router = express.Router();
var validatorpackage = require("node-input-validator");
var multer = require("multer");
// var moment = require("moment");
var fs = require("fs");
var crudModel = require("../models/crudModel");
var nodeGeocoder = require("node-geocoder");
var geocoderoptions = require("../external-config/geocoding-config");
var geocoder = nodeGeocoder(geocoderoptions);
var upload = multer();
var mailservice = require("../services/email");
var urls = require("../external-config/url-config");
var utils = require('../services/utils');
var deepclone = require('lodash.clonedeep');

var loanErrorMsg = "",
    loanError = false;

router.get("/index", function (req, res) {
    res.redirect("/");
});

router.get("/", function (req, res) {
    res.redirect("/");
});
router.get('/projects', async function (req, res) {
    var page = req.query.page || 1, rowCount = 15;
    var data = {
        page_name: 'projects',
        page_title: 'Projects',
        project_type: req.query.project_type || '',
        project_sub_type: req.query.project_sub_type || '',
        city: req.query.city || '',
        locality: req.query.locality || '',
        bedrooms: req.query.bedrooms || '',
        min_price: req.query.min_price || '',
        max_price: req.query.max_price || '',
        possession: req.query.possession || '',
        search_field: req.query.search_field || '',
        page: page,
        total_pages: 1,
        projects: []
    };
    var response1 = await crudModel.getProjectsSearchCount(req.query);
    console.log(response1);
    if (response1.success) {
        var count = response1.data.count;
        var pages = Math.ceil(count / rowCount);
        data.total_pages = pages;
    }
    var response = await crudModel.getProjectsSearch(req.query, (page - 1) * rowCount, rowCount);
    if (response.success) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].image = "1no-photo.jpg";
            var imageresponse = await crudModel.getLatestPhotoByProject(response.data[i].project_id);
            if (imageresponse.success && imageresponse.data) {
                if (imageresponse.data.photo) {
                    response.data[i].image = imageresponse.data.photo;
                }
            }
        }
        data.projects = response.data;
        // console.log(data.projects);
    }
    res.render('home/projects', data);
});
router.get('/projects/list_view', async function (req, res) {
    var page = req.query.page || 1, rowCount = 15;
    var data = {
        page_name: 'projects_list_view',
        page_title: 'Projects',
        project_type: req.query.project_type || '',
        project_sub_type: req.query.project_sub_type || '',
        city: req.query.city || '',
        locality: req.query.locality || '',
        bedrooms: req.query.bedrooms || '',
        min_price: req.query.min_price || '',
        max_price: req.query.max_price || '',
        possession: req.query.possession || '',
        search_field: req.query.search_field || '',
        page: page,
        total_pages: 1,
        projects: []
    };
    var response1 = await crudModel.getProjectsSearchCount(req.query);
    // console.log(response1);
    if (response1.success) {
        var count = response1.data.count;
        var pages = Math.ceil(count / rowCount);
        data.total_pages = pages;
    }
    var response = await crudModel.getProjectsSearch(req.query, (page - 1) * rowCount, rowCount);
    if (response.success) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].image = "1no-photo.jpg";
            var imageresponse = await crudModel.getLatestPhotoByProject(response.data[i].project_id);
            if (imageresponse.success && imageresponse.data) {
                if (imageresponse.data.photo) {
                    response.data[i].image = imageresponse.data.photo;
                }
            }
        }
        data.projects = response.data;
    }
    res.render('home/projects_list_view', data);
});

router.get('/properties', async function (req, res) {
    var page = req.query.page || 1, rowCount = 15;
    var data = {
        page_name: 'properties',
        page_title: 'Properties',
        property_type: req.query.property_type || '',
        property_sub_type: req.query.property_sub_type || '',
        city: req.query.city || '',
        locality: req.query.locality || '',
        bedrooms: req.query.bedrooms || '',
        min_price: req.query.min_price || '',
        max_price: req.query.max_price || '',
        possession: req.query.possession || '',
        search_field: req.query.search_field || '',
        page: page,
        total_pages: 1,
        properties: []
    };
    var response1 = await crudModel.getPropertiesCount(req.query);
    console.log(response1);
    if (response1.success) {
        var count = response1.data.count;
        var pages = Math.ceil(count / rowCount);
        data.total_pages = pages;
    }
    var response = await crudModel.getProperties(req.query, (page - 1) * rowCount, rowCount);
    if (response.success) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].image = "1no-photo.jpg";
            var imageresponse = await crudModel.getPropertyPhotosLimit(response.data[i].list_property_id);
            if (imageresponse.success && imageresponse.data) {
                if (imageresponse.data.photo) {
                    response.data[i].image = imageresponse.data.photo;
                }
            }
        }
        data.properties = response.data;
    }
    res.render('home/properties', data);
});
router.get('/properties/list_view', async function (req, res) {
    var page = req.query.page || 1, rowCount = 15;
    var data = {
        page_name: 'list_view',
        page_title: 'Properties',
        property_type: req.query.property_type || '',
        property_sub_type: req.query.property_sub_type || '',
        city: req.query.city || '',
        locality: req.query.locality || '',
        bedrooms: req.query.bedrooms || '',
        min_price: req.query.min_price || '',
        max_price: req.query.max_price || '',
        possession: req.query.possession || '',
        search_field: req.query.search_field || '',
        page: page,
        total_pages: 1,
        properties: []
    };
    var response1 = await crudModel.getPropertiesCount(req.query);
    console.log(response1);
    if (response1.success) {
        var count = response1.data.count;
        var pages = Math.ceil(count / rowCount);
        data.total_pages = pages;
    }
    var response = await crudModel.getProperties(req.query, (page - 1) * rowCount, rowCount);
    if (response.success) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].image = "1no-photo.jpg";
            var imageresponse = await crudModel.getPropertyPhotosLimit(response.data[i].list_property_id);
            if (imageresponse.success && imageresponse.data) {
                if (imageresponse.data.photo) {
                    response.data[i].image = imageresponse.data.photo;
                }
            }
        }
        data.properties = response.data;
    }
    res.render('home/properties_list_view', data);
});


// footer news letter api url are defined here

router.post("/add_news_letter", async function (req, res) {
    var errorMsg =
        "<div class='alert alert-error fade in'> <a href='#' data-dismiss='alert' class='close'>x</a> <strong>Sorry ! Your Subscription Has Failed Please Try Again.</strong></div>";
    var successMsg =
        "<div class='alert alert-success fade in'> <a href='#' data-dismiss='alert' class='close'>x</a> <strong>Your Have Successfully Subscribed With Us.</strong></div>";
    var response = await crudModel.getNewsLetterAvailable(req.body.email);
    if (response == 0) {
        var response1 = await crudModel.insertNewLetterSubscriber(req.body.email);
        if (response1.success) {
            var subject = "Spaces4all - Your Have Successfully Subscribed With Us";
            var html = "You have successfully subscribed with Spaces4all ! Thank you for subscribing.";
            mailservice.sendMail(subject, html, req.body.email)
            res.send(successMsg);
        } else {
            res.send(errorMsg);
        }
    } else {
        res.send(
            "<div class='alert alert-error fade in'> <a href='#' data-dismiss='alert' class='close'>x</a> <strong>Sorry ! This Email Id Already Subscribed With Us.</strong></div>"
        );
    }
});

// contacts page and related links are defined here

router.get("/contact", function (req, res) {
    res.render("home/contactus", {
        page_name: "contact",
        page_title: "Contact"
    });
});

router.post("/add_contact", upload.none(), async function (req, res) {
    let validator = new validatorpackage(req.body, {
        name: "required|minLength:3",
        email: "required|email",
        phone: "required|numeric|maxLength:12|minLength:10",
        message: "required|minLength:10"
    });

    var validatorResult = await validator.check();

    if (validatorResult) {
        var insertResult = await crudModel.insertContact(
            req.body.name,
            req.body.email,
            req.body.phone,
            req.body.message
        );
        if (insertResult.success) {
            var body =
                "Spaces4all - Contact form request details. <br><br> " +
                "<table border='1px'>" +
                "<tr><td width='100px'>Name</td><td>" +
                req.body.name +
                "</td></tr>" +
                "<tr><td>Email</td><td>" +
                req.body.email +
                "</td></tr>" +
                "<tr><td>Phone</td><td>" +
                req.body.phone +
                "</td></tr>" +
                "<tr><td>Message</td><td>" +
                req.body.message +
                "</td></tr>" +
                "</table>";
            var subject = "Spaces4all - Contact Details";
            mailservice.sendMail(subject, body);
            res.send({ success: true, message: "Thank you for use Spaces4all. We will contact you shortly" });
        } else {
            res.send({ success: false, message: "There is some issue while saving your details. Please try again later" });
        }
    } else {
        var errorMsg = "";
        Object.keys(validator.errors).map(function (key) {
            errorMsg += validator.errors[key].message + "<br/>";
        });
        res.send({ success: false, message: errorMsg });
    }
});

//Info Tab links are defined here

router.get("/information", function (req, res) {
    res.render("home/information", {
        page_name: "information",
        page_title: "Information"
    });
});

router.get("/glossarys", function (req, res) {
    res.render("home/glossarys", {
        page_name: "glossarys",
        page_title: "glossarys"
    });
});

router.get("/faqs", function (req, res) {
    res.render("home/faqs", { page_name: "faqs", page_title: "faqs" });
});

router.get("/area_conversion_calculator", function (req, res) {
    res.render("home/area_conversion_calculator", {
        page_name: "Area Conversion Calculator",
        page_title: "Area Conversion Table"
    });
});

router.get("/stamp_duty_calculator", async function (req, res) {
    var data = {
        page_name: "Stamp Duty Calculator",
        page_title: "Stamp Duty Calculator",
        stamp_duty: []
    };
    var stampDutyResponse = crudModel.getStampDuty();
    if (stampDutyResponse.success) {
        data.stamp_duty = stampDutyResponse.data;
    }
    res.render("home/stamp_duty_calculator", data);
});

//Mortagage Tab links are defined here

router.get("/emi_calculator", function (req, res) {
    res.render("home/emi_calculator", {
        page_name: "EMI Calculator",
        page_title: "EMI Calculator"
    });
});

router.get("/loan_eligibility_check", function (req, res) {
    res.render("home/loan_eligibility_check", {
        page_name: "Loan Eligibility Check",
        page_title: "Loan Eligibility Check"
    });
});

router.get("/apply_home_loan", async function (req, res) {
    var data = {
        page_name: "Apply Home Loan",
        page_title: "Apply Home Loan",
        banks: [],
        loanErrorMsg: loanErrorMsg,
        loanError: loanError
    };
    var banksResponse = await crudModel.getBanks();
    if (banksResponse.success) {
        data.banks = banksResponse.data;
    }
    res.render("home/apply_home_loan", data);
    loanError = false;
    loanErrorMsg = "";

});

router.post("/add_home_loan", function (req, res) {
    var data = req.body;
    crudModel
        .insertLoanRequest(
            data.purpose,
            data.bank,
            data.loan_amount,
            data.annual_income,
            data.name,
            data.mobile,
            data.email,
            data.dob,
            data.city
        )
        .then(function (response) {
            if (response.success) {
                var html = "Spaces4all - " +
                    data.name +
                    " has requested for loan. <br><br> " +
                    "<table border='1px'>" +
                    "<tr><td width='100px'>Purpose</td><td>" +
                    data.purpose +
                    "</td></tr>" +
                    "<tr><td>Bank</td><td>" +
                    data.bank_name +
                    "</td></tr>" +
                    "<tr><td>Loan Amount</td><td>" +
                    data.loan_amount +
                    "</td></tr>" +
                    "<tr><td>Annual Income</td><td>" +
                    data.annual_income +
                    "</td></tr>" +
                    "<tr><td>Name</td><td>" +
                    data.name +
                    "</td></tr>" +
                    "<tr><td>Email</td><td>" +
                    data.email +
                    "</td></tr>" +
                    "<tr><td>Phone</td><td>" +
                    data.mobile +
                    "</td></tr>" +
                    "<tr><td>DOB</td><td>" +
                    data.dob +
                    "</td></tr>" +
                    "<tr><td>City</td><td>" +
                    data.city +
                    "</td></tr>" +
                    "</table>";
                var subject = "Spaces4all - Loan Request Details";
                mailservice.sendMail(subject, html);
                loanError = false;
                loanErrorMsg =
                    "Thank you for your trust in spaces4all. Please wait for our call for more.";
            } else {
                loanError = true;
                loanErrorMsg = "Sorry for the inconvenience. Try again later.";
            }
            res.redirect("apply_home_loan");
        });
});

router.get("/req_docs_forloan", function (req, res) {
    res.render("home/req_docs_forloan", {
        page_name: "Apply Home Loan",
        page_title: "Apply Home Loan"
    });
});

router.get("/hot_properties/:cityId", function (req, res) {
    var cityId = req.params.cityId || "";
    crudModel.getHotPropertyDetails(cityId).then(function (hotProperties) {
        var finalHotProperties = [];
        var propertyIds = [];
        for (var i = 0; i < hotProperties.length; i++) {
            var hotProperty = hotProperties[i];
            if (!propertyIds.includes(hotProperty.list_property_id)) {
                propertyIds.push(hotProperty.list_property_id);
                if (hotProperty.property_photo == null) {
                    hotProperty.property_photo = "no-photo.jpg";
                }
                if (hotProperty.quoted_price != "") {
                    var price = hotProperty.quoted_price.replace(",", "");
                    var price1;
                    if (price > 10000000) {
                        price1 = Math.round(parseFloat(price) / 10000000, 2);
                        price1 = price1 + " Crore";
                    } else if (price > 100000) {
                        price1 = Math.round(parseFloat(price) / 100000, 2);
                        if (price1 == "100") {
                            price1 = "1 Crore";
                        } else {
                            price1 = price1 + " Lac";
                        }
                    }
                } else {
                    price1 = "Price On Request";
                }
                hotProperty.quoted_price = price1;
                finalHotProperties.push(hotProperty);
            }
        }
        // console.log(finalHotProperties);
        res.render("home/hot_properties", {
            page_name: "properties",
            page_title: "Hot Properties",
            hot_properties: finalHotProperties,
            city_id: cityId
        });
    });
});
router.post("/hot_properties", function (req, res) {
    var cityId = req.body.city;
    if (cityId != "" && cityId != undefined)
        res.redirect("hot_properties/" + cityId);
    else res.redirect("/");
});
router.get("/exclusive_projects/:cityId", function (req, res) {
    var cityId = req.params.cityId || "";
    crudModel
        .getExclusiveProjectDetails(cityId)
        .then(function (exclusiveProjects) {
            var finalExclusiveProjects = [];
            var projectIds = [];
            for (var i = 0; i < exclusiveProjects.length; i++) {
                var exclusiveProject = exclusiveProjects[i];
                if (!projectIds.includes(exclusiveProject.project_id)) {
                    projectIds.push(exclusiveProject.project_id);
                    if (exclusiveProject.project_photo == null) {
                        exclusiveProject.project_photo = "no-photo.jpg";
                    }
                    var plans = exclusiveProject.plans;
                    var plansString = "",
                        finalMinPrice;
                    if (plans != null && plans != "") {
                        var plansArray = plans.split(",");
                        for (var i = 0; i < plansArray.length; i++) {
                            plansString += plansArray[i] + " BHK";
                            if (i != plansArray.length - 1) {
                                plansString += ", ";
                            }
                        }
                        // console.log("plans String = ", plansString);
                    } else {
                        plansString = "";
                    }
                    exclusiveProject.plans = plansString;
                    if (exclusiveProject.min_price != "") {
                        var price = exclusiveProject.min_price.replace(",", "");
                        var price1;
                        if (price > 10000000) {
                            price1 = Math.round(parseFloat(price) / 10000000, 2);
                            price1 = price1 + " Crore";
                        } else if (price > 100000) {
                            price1 = Math.round(parseFloat(price) / 100000, 2);
                            if (price1 == "100") {
                                price1 = "1 Crore";
                            } else {
                                price1 = price1 + " Lac";
                            }
                        }
                    } else {
                        price1 = "Price On Request";
                    }
                    exclusiveProject.price = price1;

                    finalExclusiveProjects.push(exclusiveProject);
                }
            }
            // console.log(finalExclusiveProjects);
            res.render("home/exclusive-projects", {
                page_name: "Exclusive Projects",
                page_title: "Exclusive Projects",
                exclusive_projects: finalExclusiveProjects,
                city_id: cityId
            });
        });
});
router.post("/exclusive_projects", function (req, res) {
    var cityId = req.body.city;
    if (cityId != "" && cityId != undefined)
        res.redirect("exclusive_projects/" + cityId);
    else res.redirect("/");
});

router.get("/list_property", function (req, res) {
    res.render("home/list-property", {
        page_name: "List Property",
        page_title: "List Property"
    });
});
// router.post("/list_property", function (req, res) {

// 	var obj = { page_name: "List Property", page_title: "List Property" };
// 	if (validationError) {
// 		obj.error = validationError;
// 	}
// 	console.log(obj);
// 	res.render("home/list-property", obj);
// 	delete validationError;
// });
router.post(
    "/add_list_property",
    upload.fields([
        { name: "photos[]", maxCount: 10 },
        {
            name: "photos1[]",
            maxCount: 10
        }
    ]),
    async function (req, res) {
        // console.log(req.body);
        if (req.body.property_sub_type == 14 || req.body.property_sub_type == 18) {
            var name = req.body.name || "",
                email = req.body.email || "",
                phone = req.body.phone || "",
                propertyName = req.body.property_name || "",
                propertyType = req.body.property_type || "",
                subType = req.body.property_sub_type || "",
                facing = req.body.facing1 || "",
                city = req.body.city1 || "",
                locality = req.body.locality1 || "",
                state = req.body.state1 || 1,
                quotedPrice = req.body.quoted_price1 || "",
                plotArea = req.body.plot_area || "",
                east = req.body.east || "",
                west = req.body.west || "",
                north = req.body.north || "",
                south = req.body.south || "",
                floors = req.body.floors1 || "",
                openSlides = req.body.open_slides || "",
                width = req.body.width || "",
                constructionDone = req.body.construction_done || "",
                boundaryWall = req.body.boundary_wall || "",
                gatedColony = req.body.gated_colony || "",
                description = req.body.description1 || "",
                amenities = req.body.amenities1 || "",
                postedBy = req.body.posted_by || "Owner",
                reraId = req.body.rera_id || "";
            let validator = new validatorpackage(req.body, {
                facing1: "required|alpha",
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
                res.send({ success: false, message: errorMsg });
            } else {
                var date = utils.getDate();
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
                console.log(req.body);
                console.log("------------");
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
                    0
                );
                if (queryResult.success) {
                    var propertyId = queryResult.propertyId;
                    await crudModel.addResidentialPlotDetails(
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
                        gatedColony
                    );
                    var photoFiles = req.files["photos1[]"] || [];
                    var uploadImagesResult = await uploadImages(
                        photoFiles,
                        propertyId,
                        "public/uploads/list_property/"
                    );
                    if (uploadImagesResult.success) {
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
                property_name: "required",
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
                res.send({ success: false, message: errorMsg });
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
                    0
                );
                if (queryResult.success) {
                    var propertyId = queryResult.propertyId;
                    var photoFiles = req.files["photos[]"] || null;
                    if (photoFiles) {
                        var uploadImagesResult = await utils.uploadImages(
                            photoFiles,
                            propertyId,
                            "public/uploads/list_property/"
                        );
                        if (uploadImagesResult.success) {
                            res.send({
                                success: true,
                                message: "Thank you for your trust in space4all. Just wait few hours, we are on the job. !"
                            });
                        } else {
                            res.send({
                                success: false,
                                message: "Your Property Listing Has Failed ! Please Try Again."
                            });
                            // removeProperty(propertyId, "");
                        }
                    } else {
                        res.send({
                            success: true,
                            message: "Thank you for your trust in space4all. Just wait few hours, we are on the job. !"
                        });
                    }

                } else {
                    res.send({
                        success: false,
                        message: "Your Property Listing Has Failed ! Please Try Again."
                    });
                }
            }
        }
    }
);
router.get("/rent_in", function (req, res) {
    crudModel.getRentInDetails().then(function (rentDetails) {
        var responseObj = { page_title: "Rent In", page_name: "Rent In" };
        if (rentDetails.success && rentDetails.data != undefined) {
            var finalPrice = "";
            var rentPrice = rentDetails.data.price;
            if (rentPrice != "") {
                var tempPrice = rentPrice.replace(",", "");
                if (tempPrice > 100000) {
                    finalPrice = parseFloat(tempPrice) / 100000;
                    finalPrice = "₹  " + finalPrice + " Lac";
                } else {
                    finalPrice = "₹  " + tempPrice;
                }
            } else {
                finalPrice = "Price On Request";
            }
            if (rentDetails.data.image == "") {
                rentDetails.data.image = "no-photo.jpg";
            }
            rentDetails.data.price = finalPrice;
            responseObj.rentDetails = rentDetails.data;
        } //uploads/list_property/
        console.log(rentDetails.data);
        res.render("home/rent-in", responseObj);
    });
});
router.get("/rent_out", function (req, res) {
    var responseObj = { page_title: "Rent Out", page_name: "Rent Out" };
    res.render("home/rent-out", responseObj);
});
router.post(
    "/add_rent_out",
    upload.fields([{ name: "photos[]", maxCount: 10 }]),
    async function (req, res) {
        let validator = new validatorpackage(req.body, {
            property_name: "required",
            property_type: "required",
            property_sub_type: "required",
            facing: "required",
            state: "required",
            city: "required",
            locality: "required",
            price: "required",
            name: "required|minLength:4|maxLength:24",
            email: "required|email",
            phone: "required|numeric|minLength:10|maxLength:10",
            posted_by: "required",
            unit: "numeric|maxLength:10",
            floors: "numeric|maxLength:10"
        });
        var validationResult = await validator.check();
        if (!validationResult) {
            var errorMsg = "";
            Object.keys(validator.errors).map(function (key) {
                errorMsg += validator.errors[key].message + "<br/>";
            });
            res.send({ success: false, message: errorMsg });
        } else {
            var propertyName = req.body.property_name || "",
                propertyType = req.body.property_type || "",
                subType = req.body.property_sub_type || "",
                facing = req.body.facing || "",
                city = req.body.city || "",
                locality = req.body.locality || "",
                landMark = req.body.land_mark || "",
                state = req.body.state || "",
                maintenance = req.body.maintenance || "",
                bedrooms = req.body.bedrooms || "",
                bathrooms = req.body.bathrooms || "",
                price = req.body.price || "",
                furnishing = req.body.furnishing || "",
                unit = req.body.unit || "",
                floors = req.body.floors || "",
                securityDeposit = req.body.security_deposit || "",
                parking = req.body.parking || "",
                area = req.body.area || "",
                name = req.body.name || "",
                phone = req.body.phone || "",
                email = req.body.email || "",
                availTime = req.body.avail_time || "",
                water = req.body.water || "",
                electricity = req.body.electricity || "",
                tenents = req.body.tenents || "",
                postedBy = req.body.posted_by || "Owner",
                description = req.body.description || "",
                photo = req.body.photos || "",
                amenities1 = req.body.amenities1 || [],
                photoFiles = req.files["photos[]"] || [],
                amenities = "";
            for (var i = 0; i < amenities1.length; i++) {
                amenities += amenities1[i];
                if (i != amenities1.length - 1) {
                    amenities += ",";
                }
            }
            var date = utils.getDate();
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
            var data = {
                property_name: propertyName,
                property_type: propertyType,
                property_sub_type: subType,
                facing: facing,
                city: city,
                locality: locality,
                land_mark: landMark,
                state: state,
                maintenance: maintenance,
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                price: price,
                furnishing_status: furnishing,
                unit_no: unit,
                floors: floors,
                parking: parking,
                builtup_area: area,
                security_deposit: securityDeposit,
                name: name,
                phone: phone,
                email: email,
                available_time: availTime,
                longitude: longitude,
                latitude: latitude,
                water_availability: water,
                electricity_status: electricity,
                tenents_preferred: tenents,
                posted_by: postedBy,
                photos: "",
                description: description,
                amenities: amenities,
                status: "0",
                datetime: date
            };
            var rentResponse = await crudModel.insertToRent(data);
            if (rentResponse.success) {
                var propertyId = rentResponse.propertyId;
                var uploadImagesResult = await uploadImages(
                    photoFiles,
                    propertyId,
                    "public/uploads/rent/"
                );
                if (uploadImagesResult.success) {
                    var uploadImageString = uploadImagesResult.fileNames.toString();
                    var updatePhotosResponse = await crudModel.updatePhotosInRentField(
                        uploadImageString,
                        propertyId
                    );
                    if (updatePhotosResponse.success) {
                        res.send({
                            success: true,
                            message: "Thank you for your trust in space4all. Just wait few hours, we are on the job."
                        });
                    } else {
                        res.send({
                            success: true,
                            message: "Your Property Listing Has Failed ! Please Try Again."
                        });
                    }
                }
            } else {
                res.send({
                    success: false,
                    message: "Your Property Listing Has Failed ! Please Try Again."
                });
            }
        }
    }
);
router.get("/rent", function (req, res) {
    var propertyType = req.query.property_type || "",
        propertySubType = req.query.property_sub_type || "",
        city = req.query.city || "",
        locality = req.query.locality || "",
        bedrooms = req.query.bedrooms || "",
        postedBy = req.query.posted_by || "",
        minPrice = req.query.min_price | "",
        maxPrice = req.query.max_price || "";

    crudModel
        .getRentDetails(
            propertyType,
            propertySubType,
            city,
            locality,
            bedrooms,
            postedBy,
            minPrice,
            maxPrice
        )
        .then(function (rentDetails) {
            var rentDetailsData = rentDetails.data;
            for (var i = 0; i < rentDetailsData.length; i++) {
                var rentDetail = rentDetailsData[i];
                if (rentDetail.photos == "") {
                    rentDetail.image = "no-photo.jpg";
                } else {
                    var images = rentDetail.photos.split(",");
                    rentDetail.image = images[images.length - 1];
                }
                if (rentDetail.price) {
                    var price = rentDetail.price;
                    price = price.replace(",", "");
                    if (price > 100000) {
                        price = parseFloat(price) / 100000;
                        price = price + "Lac";
                        rentDetail.price = price;
                    } else {
                        rentDetail.price = price;
                    }
                } else {
                    rentDetail.price = "Price on Request";
                }
                rentDetailsData[i] = rentDetail;
            }
            console.log(rentDetailsData);
            res.render("home/rent", {
                page_title: "Rent",
                page_name: "Rent",
                posted_by: postedBy,
                rent: rentDetailsData,
                property_type: propertyType,
                property_sub_type: propertySubType,
                city: city,
                locality: locality,
                min_price: minPrice,
                max_price: maxPrice,
                bedrooms: bedrooms
            });
        });
});

router.get("/post_requirement", function (req, res) {
    res.render("home/post-requirement", {
        page_name: "Post Requirement",
        page_title: "Post Requirement"
    });
});

router.post("/add_post_requirement", upload.none(), async function (req, res) {
    var validatorRules = {
        property_type: "required",
        property_sub_type: "required",
        city: "required",
        locality: "required",
        state: "required",
        min_price: "required|numeric",
        max_price: "required|numeric",
        min_area: "numeric",
        max_area: "numeric",
        name: "required|minLength:4",
        email: "required|email",
        phone: "required|phoneNumber",
        avail_time: "required"
    };
    if (req.body.property_type == "1" || req.body.property_sub_type == "14") {
    } else {
        validatorRules.bedrooms = "required";
    }
    let validator = new validatorpackage(req.body, validatorRules);
    var validatorResult = await validator.check();
    if (!validatorResult) {
        var errorMessage = getErrorMessage(validator.errors);
        res.send({ success: false, message: errorMessage });
    } else {
        var propertyType = req.body.property_type || 0;
        var propertySubType = req.body.property_sub_type || 0;
        var bedrooms = req.body.bedrooms || "";
        var city = req.body.city || "";
        var locality = req.body.locality || "";
        var state = req.body.state || "";
        var minPrice = req.body.min_price;
        var maxPrice = req.body.max_price || "";
        var maxArea =
            (req.body.max_area || "") + " " + (req.body.max_area_type || "");
        var minArea =
            (req.body.min_area || "") + " " + (req.body.min_area_type || "");
        var name = req.body.name || "";
        var phone = req.body.phone || "";
        var email = req.body.email || "";
        var availTime = req.body.avail_time || "";
        var duration = req.body.duration || "";
        var type = req.body.type || "";
        var date = utils.getDate();
        var data = {
            property_type: propertyType,
            type: type,
            property_sub_type: propertySubType,
            bedrooms: bedrooms,
            city: city,
            locality: locality,
            state: state,
            min_price: minPrice,
            max_price: maxPrice,
            min_area: minArea,
            max_area: maxArea,
            name: name,
            phone: phone,
            email: email,
            available_time: availTime,
            duration: duration,
            datetime: date
        };
        var insertResponse = await crudModel.addPostRequirement(data);
        if (insertResponse.success) {
            var dataForEmail = await getPostRequirementEmailDetails(
                propertyType,
                propertySubType,
                city,
                locality,
                state,
                minPrice,
                maxPrice
            );
            var body =
                "Spaces4all - " +
                name +
                " has posted requirement. <br><br>" +
                " <table border='1px'>" +
                "<tr><td width='100px'>Property Type</td><td>" +
                dataForEmail.property_type_name +
                "</td></tr>" +
                "<tr><td>Property Sub Type</td><td>" +
                dataForEmail.property_sub_type_name +
                "</td></tr>" +
                "<tr><td>Contract Type</td><td>" +
                type +
                "</td></tr>" +
                "<tr><td>City</td><td>" +
                dataForEmail.city_name +
                "</td></tr>" +
                "<tr><td>Locality</td><td>" +
                dataForEmail.locality_name +
                "</td></tr>" +
                "<tr><td>State</td><td>" +
                dataForEmail.state_name +
                "</td></tr>" +
                "<tr><td>Min Price</td><td>" +
                dataForEmail.min_price +
                "</td></tr>" +
                "<tr><td>Max Price</td><td>" +
                dataForEmail.max_price +
                "</td></tr>" +
                "<tr><td>Min Area</td><td>" +
                minArea +
                "</td></tr>" +
                "<tr><td>Max Area</td><td>" +
                maxArea +
                "</td></tr>" +
                "<tr><td>Time Period</td><td>" +
                duration +
                "</td></tr>" +
                "<tr><td>Name</td><td>" +
                name +
                "</td></tr>" +
                "<tr><td>Email</td><td>" +
                email +
                "</td></tr>" +
                "<tr><td>Phone</td><td>" +
                phone +
                "</td></tr>" +
                "<tr><td>Available Time</td><td>" +
                availTime +
                "</td></tr>" +
                "</table>";
            var subject = "Spaces4all - Post Requirement Request";
            mailservice.sendMail(subject, body);
            res.send({
                success: true,
                message: "Your Requirement Has Posted. We will contact you soon !"
            });
        } else {
            res.send({
                success: false,
                message: "Your Requirement Has Not Posted ! Please Try Again. !"
            });
        }
    }
});

router.get("/property_details/:property_id", async function (req, res) {
    var propertyId = req.params.property_id || undefined;
    var paramsToCheck;
    if (propertyId) {
        var propertyDetails = await crudModel.getPropertyDetailsById(req.params.property_id);
        if (propertyDetails.success) {
            var amenitiesList = await crudModel.getAmenityNames(propertyDetails.data.amenities);
            propertyDetails.data.quoted_price = utils.getPrice(propertyDetails.data.quoted_price, false);
            var data = propertyDetails.data;
            var path = urls.base_url + "uploads/list_property/" + propertyDetails.data.photo;
            // if (!fs.existsSync(path)) {
            //     propertyDetails.data.photo = "1no-photo.jpg";
            // }
            if (!propertyDetails.data.photo) {
                propertyDetails.data.photo = "1no-photo.jpg";
            }
            if (data.property_sub_type == "14" || data.property_sub_type == "14") {
                paramsToCheck = ['floors', 'open_slides', 'construction_done', 'boundary_wall', 'gated_colony', 'east', 'west', 'north', 'south', 'width'];
            } else {
                paramsToCheck = [];
            }
            for (var i = 0; i < paramsToCheck.length; i++) {
                var param = paramsToCheck[i];
                if (!data[param]) {
                    propertyDetails.data[param] = 'NA';
                }
            }
            if (amenitiesList.success) {
                propertyDetails.data.amenities_list = amenitiesList.data;
                res.render("home/property_details1", {
                    page_name: "Property Details",
                    page_title: "Property Details",
                    has_details: true,
                    property_details: propertyDetails.data,
                    property_id: propertyId
                });

            } else {
                res.send('Some error occured. Please try again later !')
                console.log("error");
            }
        } else {
            if (propertyDetails.message == "No Data") {
                res.render("home/property_details1", {
                    page_name: "Property Details",
                    page_title: "Property Details",
                    has_details: false,
                });
            }
            console.log("error");
        }
    }
});
router.get('/project_details/:id', async function (req, res) {
    var id = req.params.id;
    var data = {
        page_name: 'project_details',
        page_title: 'Project Details',
        project_id: id,
        project: {}
    };
    if (id) {
        var response = await crudModel.getProjectById(id);
        if (response.success && response.data) {
            var amenitiesList = await crudModel.getAmenityNames(response.data.amenities);
            var projectPhotos = await crudModel.getPhotosByProject(id);
            if (projectPhotos.success) {
                response.data.photos = projectPhotos.data;
            } else {
                response.data.photos = [];
            }
            if (amenitiesList.success) {
                response.data.amenities_list = amenitiesList.data;
            } else {
                res.send('Some error occured. Please try again later !')
                console.log("error");
            }
            var formattedPrice = utils.getPrice({ min_price: response.data.min_price, max_price: response.data.max_price }, true)
            response.data.min_price_formatted = formattedPrice.min_price
            response.data.max_price_formatted = formattedPrice.max_price

            response.data.plans_configuration = response.data.plans_configuration ? JSON.parse(response.data.plans_configuration) : [];
            data.project = response.data;

        } else {
            res.redirect('/');
        }
        res.render('home/project_details', data);
    } else {
        res.redirect('/');
    }
});
router.get("/compare/:type", async function (req, res) {
    var type = req.params.type;
    var solutions = [];
    // req.session.compare[type] = [84, 85]
    var ids = req.session.compare[type];
    if (type == "property") {
        for (var i = 0; i < ids.length; i++) {
            var propertyId = ids[i];
            var response = await crudModel.getPropertyDetailsById(propertyId);
            if (response.success) {
                var amenitiesList = await crudModel.getAmenityNames(response.data.amenities);
                response.data.quoted_price = utils.getPrice(response.data.quoted_price, false);
                var path = urls.base_url + "uploads/list_property/" + response.data.photo;
                if (!fs.existsSync(path)) {
                    response.data.photo = "1no-photo.jpg";
                }
                if (amenitiesList.success) {
                    response.data.amenities_list = amenitiesList.data;
                    var amenitiesString = "";
                    for (var j = 0; j < response.data.amenities_list.length; j++) {
                        amenitiesString += response.data.amenities_list[j].amenity
                        if (j != (response.data.amenities_list.length - 1)) {
                            amenitiesString += ', '
                        }
                    }
                    if (amenitiesString === "") {
                        amenitiesString = "No amenities available";
                    }
                    response.data.amenities_list_string = amenitiesString

                } else {
                    res.send('Some error occured. Please try again later !');
                    console.log("error");
                }
                solutions.push(response.data)
            }
        }
        res.render('home/property_compare', {
            data: solutions,
            page_name: "Property Compare",
            page_title: "Property Compare",
            count: solutions.length
        });
    } else if (type == "project") {
        var data = {
            page_name: 'project_compare',
            page_title: 'Project Compare',
            projects: [],
            count: 0
        };
        var response = await crudModel.getProjectByIds(ids);
        if (response.success) {
            for (var i = 0; i < response.data.length; i++) {
                var amenitiesList = await crudModel.getAmenityNames(response.data[i].amenities);
                if (amenitiesList.success) {
                    response.data[i].amenities_list = amenitiesList.data;
                    var amenitiesString = "";
                    for (var j = 0; j < amenitiesList.data.length; j++) {
                        amenitiesString += amenitiesList.data[j].amenity
                        if (j != (amenitiesList.data.length - 1)) {
                            amenitiesString += ', '
                        }
                    }
                    if (amenitiesString === "") {
                        amenitiesString = "No amenities available";
                    }
                    response.data[i].amenities_list_string = amenitiesString
                } else {
                    response.data[i].amenities_list = [];
                    response.data[i].amenities_list_string = ""
                }
                var banksList = await crudModel.getBanksById(response.data[i].approved_banks);
                if (banksList.success) {
                    response.data[i].banks_list = banksList.data;
                    var banksString = "";
                    for (var j = 0; j < banksList.data.length; j++) {
                        banksString += banksList.data[j].bank_name
                        if (j != (banksList.data.length - 1)) {
                            banksString += ', '
                        }
                    }
                    if (banksString === "") {
                        banksString = "No amenities available";
                    }
                    response.data[i].banks_list_string = banksString
                } else {
                    response.data[i].banks_list = [];
                    response.data[i].banks_list_string = "";
                }
            }
            data.projects = response.data;
            data.count = response.data.length;
        }
        console.log(data.projects);
        res.render('home/project_compare', data);


    } else if (type == "rent") {
        var response = await crudModel.getRentDetailsByIds(ids);
        var data = {
            page_name: 'rent_compare',
            page_title: 'Rent Compare',
            rent: [],
            count: 0
        }
        if (response.success) {
            data.rent = response.data;
            data.count = response.data.length
        }
        console.log(data.rent);
        res.render('home/rent_compare', data);
    } else {
        res.send("incorrect url")
    }
});

// compare functions start here
router.get("/add_compare/:type/:project_id", function (req, res) {
    var projectId = req.params.project_id;
    var type = req.params.type;
    req.session.compare[type] = pushOrPopIdFromCompare(projectId, req.session.compare[type]);
    res.send({ success: true });
});

router.get("/delete_compare/:type/:project_id", function (req, res) {
    var projectId = req.params.project_id;
    var type = req.params.type;
    req.session.compare[type] = pushOrPopIdFromCompare(projectId, req.session.compare[type]);
    res.redirect('/home/compare/' + type);
});

router.get("/compare_count/:type", function (req, res) {
    var type = req.params.type;
    res.send({ success: true, count: req.session.compare[type].length || 0 });
});


function getErrorMessage(errors) {
    var errorMsg = "";
    Object.keys(errors).map(function (key) {
        errorMsg += errors[key].message + "<br/>";
    });
    return errorMsg;
}

// function getDate() {
//     return moment().format(dateFormat);
// }

async function getPostRequirementEmailDetails(
    propertyType,
    propertySubType,
    city,
    locality,
    state,
    minPrice,
    maxPrice
) {
    var propertyTypeName = "",
        propertySubTypeName = "",
        finalMinPrice = "",
        finalMaxPrice = "";
    var propertyTypeResponse = await crudModel.getPropertyTypeById(propertyType);
    if (propertyTypeResponse.success) {
        propertyTypeName = propertyTypeResponse.type;
    }
    var propertySubTypeResponse = await crudModel.getPropertySubTypeById(
        propertySubType
    );
    if (propertySubTypeResponse.success) {
        propertySubTypeName = propertySubTypeResponse.sub_type;
    }
    var city1 = await crudModel.getCityById(city);
    var cityName = ""
    if (city1.success) {
        cityName = city1.data.city;
    }
    var localityResponse = await crudModel.getLocalityById(locality);
    var localityName = localityResponse[0].locality;
    var stateResponse = await crudModel.getStateById(state);
    console.log(stateResponse);
    var stateName = stateResponse[0].state_name;

    if (minPrice > 10000000) {
        finalMinPrice = Math.round(parseFloat(minPrice) / 10000000, 2);
        finalMinPrice = finalMinPrice + " Cr";
    } else if (minPrice > 100000) {
        finalMinPrice = Math.round(parseFloat(minPrice) / 100000, 2);
        finalMinPrice = finalMinPrice + " Lac";
    } else {
        finalMinPrice = minPrice;
    }
    if (maxPrice > 10000000) {
        finalMaxPrice = Math.round(parseFloat(maxPrice) / 10000000, 2);
        finalMaxPrice = finalMaxPrice + " Cr";
    } else if (maxPrice > 100000) {
        finalMaxPrice = Math.round(parseFloat(maxPrice) / 100000, 2);
        finalMaxPrice = finalMaxPrice + " Lac";
    } else {
        finalMaxPrice = maxPrice;
    }
    return {
        property_type_name: propertyTypeName,
        property_sub_type_name: propertySubTypeName,
        city_name: cityName,
        locality_name: localityName,
        state_name: stateName,
        min_price: finalMinPrice,
        max_price: finalMaxPrice
    };
}

function pushOrPopIdFromCompare(id, compareArray) {
    if (compareArray.includes(id)) {
        compareArray.splice(compareArray.indexOf(id), 1);
    } else {
        compareArray.push(id);
    }
    return compareArray
}

async function uploadImages(photoFiles, propertyId, path) {
    if (photoFiles.length) {
        var imagesToUpload = [];
        var fileNames = [];
        for (var i = 0; i < photoFiles.length; i++) {
            var fileName = photoFiles[i].originalname;//propertyId + "|" +
            var uploadResponse = await utils.writeFile(
                fileName,
                photoFiles[i].buffer,
                path
            );
            if (uploadResponse.success) {
                fileNames.push(fileName);
                var photoFile = [propertyId, fileName, utils.getDate()];
                imagesToUpload.push(photoFile);
            }
        }
        var response = await crudModel.addPropertyPhotos(imagesToUpload);
        if (response.success) {
            return { success: true, fileNames: fileNames };
        } else {
            return { success: false };
        }
    }
}

module.exports = router;