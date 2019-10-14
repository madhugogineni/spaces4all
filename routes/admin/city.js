var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require('multer');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'city',
        page_title: 'city',
        cities: []
    };
    var cityResponse = await crudModel.getCity();
    if (cityResponse.success) {
        data.cities = cityResponse.data;
    }
    res.render('admin/city', data);
});
router.get('/:id', async function (req, res) {
    var id = req.params.id;
    if (!id) {
        var cityResponse = await crudModel.getCityById(id);
        if (cityResponse.success) {
            res.send(cityResponse);
        } else {
            res.send({success: false, message: 'Some error occurred! Please try again later.'});
        }
    } else {
        res.send({success: false, message: 'Invalid Id'});
    }
});
router.post('/add', upload.none(), async function (req, res) {
    var data = req.body;
    if (data.city) {
        await crudModel.addCity(data);
    }
    res.redirect('/admin/city');
});
router.post('/update', upload.none(), async function (req, res) {
    if (req.body.city_id && req.body.city_name) {
        var data = req.body;
        data.city = data.city_name;
        delete data.city_name;
        await crudModel.updateCity(data);
    }
    res.redirect('/admin/city');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteCity(id);
    }
    res.redirect('/admin/city');
})
module.exports = router;