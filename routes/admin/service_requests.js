var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'services_requests',
        page_title: 'Services Requests',
        service_requests: []
    };
    var serviceRequestResponse = await crudModel.getServicesRequests();
    if (serviceRequestResponse.success) {
        data.service_requests = serviceRequestResponse.data;
    }
    res.render('admin/service_requests', data);
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteServicesRequests(id);
    }
    res.redirect('/admin/services_requests');
});
module.exports = router;