var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'amenities',
        page_title: 'Amenities',
        amenities: []
    }
    var amenitiesResponse = await crudModel.getAmenities();
    if (amenitiesResponse.success) {
        data.amenities = amenitiesResponse.data;
    }
    res.render('admin/project/amenities', data);
});

router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await crudModel.addAmenity(data);
    res.redirect('/admin/amenity');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteAmenity(id);
    }
    res.redirect('/admin/amenity');
});
router.post('/update', upload.none(), async function (req, res) {
    console.log(req.body);
    if (req.body.amenity1 && req.body.amenity_id) {
        var data = deepclone(req.body);
        data.amenity = data.amenity1;
        data.amenity_icon = data.amenity_icon1;
        delete data.amenity1;
        delete data.amenity_icon1;
        await crudModel.updateAmenity(data, req.body.amenity_id);
    }
    res.redirect('/admin/amenity');
});
module.exports = router;