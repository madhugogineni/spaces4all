var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function(req,res) {
    var data = {
        page_name: 'banks',
        page_title: 'Banks',
        banksResponse: []
    }
    var banksResponse = await crudModel.getBanks();
    if(banksResponse.success) {
        data.banks = banksResponse.data;
    }
    res.render('admin/project/banks',data);
});

router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await crudModel.addBank(data);
    res.redirect('/admin/banks');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteBank(id);
    }
    res.redirect('/admin/banks');
});
router.post('/update', upload.none(), async function (req, res) {
    console.log(req.body);
    if (req.body.bank_name1 && req.body.bank_id) {
        var data = deepclone(req.body);
        data.bank_name = data.bank_name1;
        delete data.bank_name1;
        await crudModel.updateBank(data, req.body.bank_id);
    }
    res.redirect('/admin/banks');
});
module.exports = router;