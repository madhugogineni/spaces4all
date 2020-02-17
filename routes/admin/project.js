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
    var data = {
        page_name: 'project',
        page_title: 'Projects',
        project_type: req.query.project_type || '',
        project_sub_type: req.query.project_sub_type || '',
        city: req.query.city || '',
        locality: req.query.locality || '',
        bedrooms: req.query.bedrooms || '',
        min_price: req.query.min_price || '',
        max_price: req.query.max_price || '',
        possession: req.query.possession || '',
    };
    var projectsResponse = await crudModel.getProjectsSearch(req.query);
    if (projectsResponse.success) {
        data.projects = projectsResponse.data
        data.projects.forEach((project, index) => {
            var formattedPrice = utils.getPrice({ min_price: project.min_price, max_price: project.max_price }, true)
            data.projects[index].min_price_formatted = formattedPrice.min_price
            data.projects[index].max_price_formatted = formattedPrice.max_price
        });
    } else {
        data.projects = []
    }
    res.render('admin/project/projects', data);
});
router.get('/add', function (req, res) {
    res.render('admin/project/add_project', { page_name: 'add_projects', page_title: 'Add Projects' });
});

router.post('/add', upload.none(), async function (req, res) {
    var addProjectResponse = await addProject(req);
    if (addProjectResponse.success) {
        res.send({ success: true, message: "Successfully created !" })
    } else {
        isAddErrorPresent = true;
        res.send({ success: false, message: "There was an error while creating! Please try again later" })
    }
});
router.get('/photos/:project_id', async function (req, res) {
    var id = req.params.project_id;
    if (id) {
        var data = {
            page_name: 'project_photos',
            page_title: 'Project Photos',
            project_id: id
        };
        var response = await crudModel.getPhotosByProject(id);
        if (response.success) {
            // for (var i = 0; i < response.data.length; i++) {
            //     var path = urls.base_url + "uploads/projects/" + response.data[i].photo;
            //     if (!fs.existsSync(path)) {
            //         response.data[i].photo = "no-photo.jpg";
            //     }
            // }
            data.photos = response.data;
        }
        res.render('admin/project/photos', data);
    } else {
        res.redirect('/admin/projects');
    }
});
router.post('/photos/add/:project_id', upload.array('photos[]', 10), async function (req, res) {
    var id = req.params.project_id;
    if (id) {
        await uploadImages(req.files, id, "public/uploads/projects/");
    }
    res.redirect('/admin/projects');
});
router.get('/photos/delete/:photo_id/:project_id', async function (req, res) {
    var id = req.params.photo_id;
    var projectId = req.params.project_id;
    if (id && projectId) {
        var imageResponse = await crudModel.getProjectPhotoById(id);
        if (imageResponse.success) {
            var response = await crudModel.deleteProjectPhoto(id);
            if (response.success) {
                utils.deleteFile(imageResponse.data.photo, "public/uploads/projects/");
            }
        }
    }
    res.redirect('/admin/projects/photos/' + projectId);
});
router.get('/exclusive/:value/:project_id', function (req, res) {
    var value = req.params.value, projectId = req.params.project_id
    if (value == 'undefined' || value == null) {
        value = 0;
    }
    if (projectId) {
        crudModel.updateColumnInProjects('exclusive', value, projectId)
    }
    res.redirect('/admin/projects');
});
router.get('/status/:value/:project_id', function (req, res) {
    var value = req.params.value, projectId = req.params.project_id
    if (value == 'undefined' || value == null) {
        value = 0;
    }
    if (projectId) {
        crudModel.updateColumnInProjects('project_status', value, projectId)
    }
    res.redirect('/admin/projects');
});
router.get('/featured/:value/:project_id', function (req, res) {
    var value = req.params.value, projectId = req.params.project_id
    if (value == 'undefined' || value == null) {
        value = 0;
    }
    if (projectId) {
        crudModel.updateColumnInProjects('featured_project', value, projectId)
    }
    res.redirect('/admin/projects');
});

router.get('/delete/:project_id', async function (req, res) {
    var projectId = req.params.project_id;
    if (projectId) {
        await crudModel.deleteProject(projectId)
    }
    res.redirect('/admin/projects')
});

router.get('/configurations/:project_id', async function (req, res) {
    var projectId = req.params.project_id;
    var data = {
        page_name: 'project_configurations',
        page_title: 'Project Configurations',
        project_id: projectId
    };
    var configurationsResponse = await crudModel.getProjectConfigurations(projectId);
    configurationsResponse.success ? data.configurations = configurationsResponse.data : data.configurations = []

    res.render('admin/project/project_configuration', data)
})

router.get('/configurations/delete/:project_id/:configuration_id', async function (req, res) {
    var projectId = req.params.project_id, configurationId = req.params.configuration_id;
    await crudModel.deleteProjectConfiguration(configurationId);
    res.redirect('/admin/project_configurations/' + projectId);
})
router.post('/configurations/edit/:project_id', upload.none(), async function (req, res) {
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
router.post('/configurations/add/:project_id', upload.none(), async function (req, res) {
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
router.get('/edit/:project_id', async function (req, res) {
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
        res.render('admin/project/edit_project', data);
    } else {
        res.redirect('/admin/')
    }

});
router.post('/update/:project_id', upload.none(), async function (req, res) {
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
            message: "Invalid Project."
        });
    }
});
router.get('/:project_id', async function (req, res) {
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
            res.send({ success: false });
        }
    } else {
        res.send({ success: false });
    }
});

async function addProject(req, projectId) {
    console.log(req.body.plans_configuration);
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
        plansString = "",
        plansConfiguration = req.body.plans_configuration || "[]",
        reraId = req.body.rera_id || "";
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
        'latitude': latitude,
        'rera_id': reraId,
        'plans_configuration': plansConfiguration
    }, projectId);
    return addProjectResponse;
}

async function uploadImages(photoFiles, id, path) {
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
                var photoFile = [id, fileName];
                imagesToUpload.push(photoFile);
            }
        }
        var response = await crudModel.addProjectPhotos(imagesToUpload);
        if (response.success) {
            return { success: true, fileNames: fileNames };
        } else {
            return { success: false };
        }
    }
}

module.exports = router;