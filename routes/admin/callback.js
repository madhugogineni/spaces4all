var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'call_back',
        page_title: 'Callback Details',
        call_backs: []
    };
    var callbackResponse = await crudModel.getCallBack();
    if (callbackResponse.success) {
        data.call_backs = callbackResponse.data;
    }
    res.render('admin/callback', data);
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteCallback(id);
    }
    res.redirect('/admin/call_back');
});
module.exports = router;