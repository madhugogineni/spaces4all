var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
var utils = require('../../services/utils');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'testimonial',
        page_title: 'Testimonial'
    };
    var testimonialResponse = await crudModel.getTestimonial();
    if (testimonialResponse.success) {
        data.testimonials = testimonialResponse.data;
    }
    res.render('admin/testimonial', data);
});
router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    data.datetime = utils.getDate();
    await crudModel.addTestimonial(data);
    res.redirect('/admin/testimonial');
})
router.post('/update', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    var id = req.body.testimonial_id
    if (id) {
        data.name = data.name1;
        data.company = data.company1;
        data.testimonial = data.testimonial1;
        delete data.name1;
        delete data.company1;
        delete data.testimonial1;
        delete data.testimonial_id;
        await crudModel.updateTestimonial(data, id);
    }
    res.redirect('/admin/testimonial');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteTestimonial(id);
    }
    res.redirect('/admin/testimonial');
})
module.exports = router;