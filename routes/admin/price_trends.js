var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'price_trends',
        page_title: 'Price Trends',
        price_trends: []
    };
    var priceTrendsResponse = await crudModel.getPriceTrends();
    if (priceTrendsResponse.success) {
        data.price_trends = priceTrendsResponse.data;
    }
    res.render('admin/price_trends', data);
});
router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await crudModel.addPriceTrends(data);
    res.redirect('/admin/price_trends');
})
router.post('/update', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    var id = req.body.price_trend_id;
    if (id) {
        data.type = data.type1;
        data.city = data.city1;
        data.locality = data.locality1;
        data.min_price = data.min_price1;
        data.max_price = data.max_price1;
        delete data.type1;
        delete data.city1;
        delete data.locality1;
        delete data.min_price1;
        delete data.max_price1;
        delete data.price_trend_id;
        await crudModel.updatePriceTrends(data, id);
    }
    res.redirect('/admin/price_trends');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deletePriceTrends(id);
    }
    res.redirect('/admin/price_trends');
});
module.exports = router;