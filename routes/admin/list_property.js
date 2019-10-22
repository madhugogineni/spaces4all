var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require('multer');
var upload = multer();
var utils = require('../../services/utils');
var validatorpackage = require("node-input-validator");
var nodeGeocoder = require("node-geocoder");
var geocoderoptions = require("../../external-config/geocoding-config");
var geocoder = nodeGeocoder(geocoderoptions);
var deepclone = require('lodash.clonedeep');

router.get('/', async function (req, res) {
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

router.get('/status/:value/:property_id', async function (req, res) {
    var propertyId = req.params.property_id, value = req.params.value;
    var updateResponse = crudModel.updateColumnInListProperty('status', value, propertyId)
    res.redirect('/admin/list_property')
});
router.get('/hot/:value/:property_id', async function (req, res) {
    var propertyId = req.params.property_id, value = req.params.value;
    var updateResponse = crudModel.updateColumnInListProperty('hot_property', value, propertyId)
    res.redirect('/admin/list_property')
});
router.get('/latest/:value/:property_id', async function (req, res) {
    var propertyId = req.params.property_id, value = req.params.value;
    var updateResponse = crudModel.updateColumnInListProperty('latest_property', value, propertyId)
    res.redirect('/admin/list_property')
});
router.get('/:property_id', async function (req, res) {
    var propertyId = req.params.property_id;

    if (propertyId != '' && propertyId != null && propertyId != undefined) {
        var propertyResponse = await crudModel.getPropertyDetailsById(propertyId)
        if (propertyResponse.success) {
            propertyResponse.data.quoted_price = utils.getPrice(propertyResponse.data.quoted_price, false);
            var amenitiesList = await crudModel.getAmenityNames(propertyResponse.data.amenities);
            if (amenitiesList.success) {
                propertyResponse.data.amenities_list = amenitiesList.data;
            }
            res.send(propertyResponse)
        } else {
            res.send({success: false});
        }
    }
});
router.get('/delete/:property_id', async function (req, res) {
    var propertyId = req.params.property_id;
    if (propertyId) {
        await crudModel.deleteProperty(propertyId)
    }
    res.redirect('/admin/list_property')
});
router.get('/edit/:property_id?', async function (req, res) {

    var propertyId = req.params.property_id;
    var invalid = false
    if (propertyId) {
        var propertyResponse = await crudModel.getPropertyDetailsById(propertyId)
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
router.post('/update/:property_id', upload.none(),
    async function (req, res) {
        var propertyId = req.params.property_id;
        var isError = false;
        if (propertyId) {
            if (req.body.property_sub_type == 14 || req.body.property_sub_type == 18) {
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
                    var data = deepclone(req.body);
                    var date = utils.getDate();
                    var city1 = await crudModel.getCityById(req.body.city);
                    var cityName = ""
                    if (city1.success) {
                        cityName = city1.data.city;
                    }
                    var locality1 = await crudModel.getLocalityById(req.body.locality);
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
                    data.lat = latitude;
                    data.lan = longitude;
                    data.amenities = data.amenities1 ? data.amenities1.toString() : "";
                    delete data.amenities1;
                    data.possession = "";
                    data.status = 0;
                    delete data.bedrooms;
                    delete data.bathrooms;
                    delete data.floors1;
                    delete data.saleable_area;
                    data.saleable_area = data.plot_area;
                    delete data.plot_area;
                    delete data.construction_age;
                    delete data.floor_no;
                    delete data.furnishing_status;
                    delete data.car_parking;
                    delete data.north;
                    delete data.south;
                    delete data.west;
                    delete data.east;
                    delete data.open_slides;
                    delete data.width;
                    delete data.construction_done;
                    delete data.boundary_wall;
                    delete data.gated_colony;
                    var residentialPlotDetails = {
                        north: req.body.north,
                        south: req.body.south,
                        east: req.body.east,
                        west: req.body.west,
                        open_slides: req.body.open_slides,
                        width: req.body.width,
                        construction_done: req.body.construction_done,
                        boundary_wall: req.body.boundary_wall,
                        gated_colony: req.body.gated_colony
                    };
                    var queryResult = await crudModel.updateListProperty(data, propertyId);
                    if (queryResult.success) {
                        var detailsResponse = await crudModel.updateResidentialPlotDetails(residentialPlotDetails, propertyId);
                        if (!detailsResponse.success) {
                            isError = true;
                            // removeProperty(propertyId, "14");
                        }
                    } else {
                        isError = true;
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
                    res.end();
                } else {
                    var data = deepclone(req.body);
                    data.amenities = data.amenities1 ? data.amenities1.toString() : "";
                    delete data.amenities1;
                    data.possession = "";
                    data.status = 0;
                    delete data.plot_area;
                    delete data.floors1;
                    delete data.open_slides;
                    delete data.width;
                    delete data.construction_done;
                    delete data.boundary_wall;
                    delete data.gated_colony;
                    delete data.east;
                    delete data.west;
                    delete data.north;
                    delete data.south;
                    var date = utils.getDate();
                    var city1 = await crudModel.getCityById(req.body.city);
                    var cityName = ""
                    if (city1.success) {
                        cityName = city1.data.city;
                    }
                    var locality1 = await crudModel.getLocalityById(req.body.locality);
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
                    var queryResult = await crudModel.updateListProperty(data, propertyId);
                    if (!queryResult.success) {
                        isError = true;
                    }
                }
            }
            if (isError) {
                res.send({
                    success: false,
                    message: "Your Property Listing Has Failed ! Please Try Again."
                });
            } else {
                res.send({
                    success: true,
                    message: "Thank you for your trust in space4all. Just wait few hours, we are on the job. !"
                });
            }
        } else {
            res.redirect('/admin')
        }
    });
router.get('photos/:property_id?', async function (req, res) {
    var propertyId = req.params.property_id
    if (propertyId) {
        res.send('welcome')
    } else {
        res.redirect('/admin/')
    }
});


module.exports = router;