var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
var utils = require('../../services/utils');
var urls = require('../../external-config/url-config');
var fs = require('fs');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'partners',
        page_title: 'Partners'
    };
    var partnerResponse = await crudModel.getPartners();
    if (partnerResponse.success) {
        var partners = partnerResponse.data;
        for (var i = 0; i < partners.length; i++) {
            if (!partners[i].image) {
                partners[i].image = "1no-photo.jpg";
                continue;
            }
            // var path = urls.base_url + "uploads/partners/" + partners[i].image;
            // if (!fs.existsSync(path)) {
            //     partners[i].image = "1no-photo.jpg";
            // }
        }
        data.partners = partners;
    }
    res.render('admin/partners', data);
});
router.post('/add', upload.single('image'), async function (req, res) {
    console.log(req.body);
    console.log(req.file);
    var data = deepclone(req.body);
    var file = deepclone(req.file);
    data.image = file.originalname;
    var addResponse = await crudModel.addPartner(data);
    if (addResponse.success) {
        await utils.writeFile(file.originalname, file.buffer, "public/uploads/partners/");
    }
    res.redirect('/admin/partners');
})
router.post('/update', upload.single('image1'), async function (req, res) {
    var oldFile = deepclone(req.body.old_image);
    var data = deepclone(req.body);
    var file = deepclone(req.file);
    var id = req.body.partner_id;
    data.image = file.originalname;
    data.url = data.url1;
    delete data.url1;
    delete data.old_image;
    delete data.partner_id;
    if (id) {
        var updateResponse = await crudModel.updatePartner(data, id);
        if (updateResponse.success) {
            try {
                utils.deleteFile(oldFile, 'public/uploads/partners/');
                utils.writeFile(file.originalname, file.buffer, 'public/uploads/partners/');

            } catch (e) {
                console.log(e);
            } finally {

            }
        }
    }
    res.redirect('/admin/partners');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deletePartner(id);
    }
    res.redirect('/admin/partners');
})
module.exports = router;