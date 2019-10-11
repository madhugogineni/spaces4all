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
var rent = require('./rent');

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
router.use('/rent', rent);
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
            propertyResponse.data.quoted_price = utils.getPrice(propertyResponse.data.quoted_price, false);
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
            res.redirect('/admin')
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
        if(addResponse.success) {
            res.send({
                success: true,
                message: "Your Project Updating Successful !"
            });

        }else {
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
        res.end({success: true, data: getTemplateForMail(fileName, req.query)});
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


function getTemplateForMail(fileName, parameters) {
    var result = ejs.compile(fs.readFileSync(__dirname + '/../views/mailers/' + fileName, 'utf8'));
    var html = result(parameters);
    return html;
}

module.exports = router;
