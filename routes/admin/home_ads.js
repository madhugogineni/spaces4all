var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
var utils = require('../../services/utils');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'home_ads',
        page_title: 'Home Ads',
        home_ads: []
    };
    var response = await crudModel.getHomeAds();
    if (response.success) {
        data.home_ads = response.data;
    }
    res.render('admin/home_ads', data);
});
router.post('/add', upload.single('photos'), async function (req, res) {
    var data = deepclone(req.body);
    var file = req.file;
    data.image = file.originalname;
    var response = await crudModel.addHomeAds(data);
    if (response.success) {
        utils.writeFile(file.originalname, file.buffer, 'public/uploads/home-ads/');
    }
    res.redirect('/admin/home_ads');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        var response = await crudModel.getHomeAdById(id);
        var response1 = await crudModel.deleteHomeAds(id);
        if(response.success) {
            if(response1.success) {
                if(response.data) {
                    var oldFile = response.data.image;
                    utils.deleteFile(oldFile, 'public/uploads/home-ads/');
                }
            }
        }
    }
    res.redirect('/admin/home_ads');
});
module.exports = router;