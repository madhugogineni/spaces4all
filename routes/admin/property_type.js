var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'property_type',
        page_title: 'Property Type',
        property_types: []
    }
    var propertyTypeResponse = await crudModel.getPropertyType();
    if (propertyTypeResponse.success) {
        data.property_types = propertyTypeResponse.data;
    }
    res.render('admin/property/property_type', data);
});

router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await crudModel.addPropertyType(data);
    res.redirect('/admin/property_type');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deletePropertyType(id);
    }
    res.redirect('/admin/property_type');
});
router.post('/update', upload.none(), async function (req, res) {
    if (req.body.type1 && req.body.property_type_id) {
        var data = deepclone(req.body);
        data.type = data.type1;
        delete data.type1;
        delete data.property_type_id;
        await crudModel.updatePropertyType(data, req.body.property_type_id);
    }
    res.redirect('/admin/property_type');
});
module.exports = router;