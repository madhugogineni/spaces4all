var express = require('express');
var router = express.Router();
var stocksModel = require('../../models/stocksModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'stocks',
        page_title: 'Stocks'
    };
    var stocksResponse = await stocksModel.getStocks();
    if (stocksResponse.success) {
        data.stocks = stocksResponse.data;
    }
    res.render('admin/stocks/list', data);
});
router.post('/', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await stocksModel.add(data);
    res.redirect('/admin/stocks');
})
router.post('/update', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    data.name = data.name1;
    data.code = data.code1;
    delete data.name1;
    delete data.code1;
    var id = req.body.id
    if (id) {
        delete data.id;
        await stocksModel.updateStock(data, id);
    }
    res.redirect('/admin/stocks');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await stocksModel.deleteStock(id);
    }
    res.redirect('/admin/stocks');
});
module.exports = router;