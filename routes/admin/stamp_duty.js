var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'stamp_duty',
        page_title: 'Stamp Duty',
        stamp_duties: []
    };
    var stampDutyResponse = await crudModel.getStampDuty();
    if (stampDutyResponse.success) {
        data.stamp_duties = stampDutyResponse.data;
    }
    res.render('admin/stamp_duty', data);
});
router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await crudModel.addStampDuty(data);
    res.redirect('/admin/stamp_duty');
})
router.post('/update', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    var id = req.body.stamp_duty_id
    if (id) {
        data.state = data.state1;
        data.percentage = data.percentage1;
        delete data.state1;
        delete data.percentage1;
        delete data.stamp_duty_id;
        await crudModel.updateStampDuty(data, id);
    }
    res.redirect('/admin/stamp_duty');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteStampDuty(id);
    }
    res.redirect('/admin/stamp_duty');
});
module.exports = router;