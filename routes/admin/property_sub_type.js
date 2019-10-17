var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'property_sub_type',
        page_title: 'Property Sub Type',
        property_sub_types: []
    }
    var propertySubTypeResponse = await crudModel.getPropertySubType();
    if (propertySubTypeResponse.success) {
        data.property_sub_types = propertySubTypeResponse.data;
    }
    res.render('admin/property/property_sub_type', data);
});

router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await crudModel.addPropertySubType(data);
    res.redirect('/admin/property_sub_type');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deletePropertySubType(id);
    }
    res.redirect('/admin/property_sub_type');
});
router.post('/update', upload.none(), async function (req, res) {
    if (req.body.property_sub_type_id && req.body.sub_type1) {
        var data = deepclone(req.body);
        data.sub_type = data.sub_type1;
        data.property_type_id = data.property_type_id1;
        delete data.sub_type1;
        delete data.property_type_id1;
        await crudModel.updatePropertySubType(data, req.body.property_sub_type_id);
    }
    res.redirect('/admin/property_sub_type');
});
module.exports = router;