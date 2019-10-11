var express = require('express');
var router = express.Router({mergeParams: true});
var crudModel = require('../models/crudModel');
var validationPackage = require('../services/validation');
var multer = require('multer');
var upload = multer();

router.get('/', async function (req, res) {
    var data = {
        'page_name': 'rent',
        'page_title': 'Rent',
        'rent': []
    };
    var rentReponse = await crudModel.getRentAll();
    if (rentReponse.success) {
        data.rent = rentReponse.data;
    }
    res.render('admin/rent/rent', data);
})
router.get('/add/:status/:id', async function (req, res) {
    var id = req.params.id;
    var status = req.params.status;
    if (status != undefined && id != undefined && status != null && id != null) {
        if (status == 0) {
            await crudModel.deleteFromRentToAdd(id);
        } else if (status == 1) {
            await crudModel.addRentToAdd(id);
        }
    }
    res.redirect('/admin/rent');
});
router.get('/status/:status/:id', async function (req, res) {
    var id = req.params.id;
    var status = req.params.status;
    if (status != undefined && id != undefined && status != null && id != null) {
        await crudModel.updateRent({rent_id: id, status: status});
    }
    res.redirect('/admin/rent');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id != undefined && id != null) {
        await crudModel.deleteRent(id);
    }
    res.redirect('/admin/rent');
});
router.get('/edit/:id', async function (req, res) {
    var id = req.params.id;
    if (id == undefined || id == null) {
        res.redirect('/admin/rent');
    } else {
        var data = {
            page_name: 'edit_rent',
            page_title: 'Edit Rent',
            rent_id: id,
            rent_details: null
        };
        var rentResponse = await crudModel.getRentDetailsById(id);
        if (rentResponse.success) {
            data.rent_details = rentResponse.data;
        }
        res.render('admin/rent/edit_rent', data);
    }
});
router.post('/update/:id', upload.none(), async function (req, res) {
    console.log(req.body);
    var validationResponse = await validationPackage.validate(req.body, {
        property_name: 'required',
        property_type: 'required',
        property_sub_type: 'required',
        facing: 'required',
        city: 'required',
        locality: 'required',
        name: 'required|minLength:4|maxLength:12',
        email: 'required|email',
        phone: 'required|numeric|minLength:10|maxLength:10',
        posted_by: 'required'
    });
    console.log(validationResponse);
    if (!validationResponse.success) {
        res.send(validationResponse);
    } else {

    }

});
module.exports = router;