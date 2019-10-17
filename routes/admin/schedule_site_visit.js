var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'schedule_site_visit',
        page_title: 'Site Visits'
    };
    var sitesResponse = await crudModel.getScheduleSiteVisit();
    if (sitesResponse.success) {
        data.site_visits = sitesResponse.data;
    }
    res.render('admin/schedule_site_visit', data);
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteScheduleSiteVisit(id);
    }
    res.redirect('/admin/schedule_site_visit');
});
module.exports = router;