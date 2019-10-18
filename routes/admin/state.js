var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'state',
        page_title: 'State'
    };
    var stateResponse = await crudModel.getStates();
    if (stateResponse.success) {
        data.states = stateResponse.data;
    }
    res.render('admin/state', data);
});
router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    data.state_name = data.state;
    delete data.state;
    await crudModel.addState(data);
    res.redirect('/admin/state');
})
router.post('/update', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    var id = req.body.state_id
    if (id) {
        delete data.state_id;
        await crudModel.updateState(data, id);
    }
    res.redirect('/admin/state');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteState(id);
    }
    res.redirect('/admin/state');
});
module.exports = router;