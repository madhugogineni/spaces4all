var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'state',
        page_title: 'State'
    };
    var stateResponse = await crudModel.getStates();
    // if()
});
module.exports = router;