var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var deepclone = require('lodash.clonedeep');
var multer = require('multer');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'locality',
        page_title: 'Locality',
        localities: []
    }
    var localityResponse = await crudModel.getLocality();
    if (localityResponse.success) {
        data.localities = localityResponse.data;
    }
    res.render('admin/locality', data);
});
router.post('/add', upload.none(), async function (req, res) {
    var city = req.body.city;
    var locality = req.body.locality;
    await crudModel.addLocality({city_id: city, locality: locality});
    res.redirect('/admin/locality');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteLocality(id);
    }
    res.redirect('/admin/locality');
});
router.post('/update', upload.none(), async function (req, res) {
    if (req.body.locality_id && req.body.city1) {
        var data = deepclone(req.body);
        data.city_id = data.city1;
        delete data.city1;
        delete data.locality_id;
        await crudModel.updateLocality(data, req.body.locality_id);
    }
    res.redirect('/admin/locality');
});
module.exports = router;