var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
var utils = require('../../services/utils');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'home_slide',
        page_title: 'Home Slide',
        home_slides: []
    };
    var response = await crudModel.getHomeSlide();
    if (response.success) {
        data.home_slides = response.data;
    }
    res.render('admin/home_slides', data);
});
router.post('/add', upload.single('photos'), async function (req, res) {
    var data = deepclone(req.body);
    var file = req.file;
    data.image = file.originalname;
    var response = await crudModel.addHomeSlide(data);
    if (response.success) {
        utils.writeFile(file.originalname, file.buffer, 'public/uploads/home-slide/');
    }
    res.redirect('/admin/home_slide');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        var response = await crudModel.getHomeSlideById(id);
        var response1 = await crudModel.deleteHomeSlide(id);
        if (response.success) {
            if (response1.success) {
                if (response.data) {
                    var oldFile = response.data.image;
                    utils.deleteFile(oldFile, 'public/uploads/home-slide/');
                }
            }
        }
    }
    res.redirect('/admin/home_slide');
});
module.exports = router;