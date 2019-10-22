var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/:type', async function (req, res) {
    var type = req.params.type;
    var data = {
        enquiries: []
    };
    var render = ""
    if (type == 'property') {
        data.page_name = 'property_enquiry';
        data.page_title = 'Property Enquiry';
        var response = await crudModel.getPropertyEnquiry();
        console.log(response);
        if (response.success) {
            data.enquiries = response.data;
        }
        render = 'admin/enquiry/property_enquiry';
    } else if (type == 'project') {
        data.page_name = 'project_enquiry';
        data.page_title = 'Project Enquiry';
        var response = await crudModel.getProjectEnquiry();
        if (response.success) {
            data.enquiries = response.data;
        }
        render = 'admin/enquiry/project_enquiry';
    } else if (type == 'rent') {
        data.page_name = 'rent_enquiry';
        data.page_title = 'Rent Enquiry';
        var response = await crudModel.getRentEnquiry();
        if (response.success) {
            data.enquiries = response.data;
        }
        render = 'admin/enquiry/rent_enquiry';
    } else {
        res.redirect('/admin');
    }
    console.log(data);
    res.render(render, data);
});
router.get('/:type/delete/:id', async function (req, res) {
    var id = req.params.id;
    var type = req.params.type;
    if (id) {
        if (type == 'property') {
            await crudModel.deletePropertyEnquiry(id);

        } else if (type == 'project') {
            await crudModel.deleteProjectEnquiry(id);

        } else if (type == 'rent') {
            await crudModel.deleteRentEnquiry(id);
        } else {
            type = 'property';
        }
    }
    res.redirect('/admin/enquiry/' + type);
});
module.exports = router;