var express = require('express');
var router = express.Router();
var stocksModel = require('../../models/stocksModel');
var stockDataModel = require('../../models/stockDataModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
const moment = require('moment');
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

router.get('/download', async function (req, res) {
    var params = req.query;
    var data = {
        page_name: 'Stock Download',
        page_title: 'Stock Download',
        search_by: '',
        metric: '',
        stock: '',
        stock_data: {
            data: [],
            date_list: []
        },
    };
    if (params.search_by) {
        data.search_by = params.search_by;
    }

    var stocksList = await stocksModel.getStocks();
    if (stocksList.success) {
        data.stocks_list = stocksList.data;
    }

    switch (params.search_by) {
        case 'stock':
            data.stock = params.stock;
            var latestStockData = await stockDataModel.getLastMonthStockData(params.stock);
            if (latestStockData.success) {
                latestStockData.data.forEach(function (item) {
                    item.cur_date = moment(item.cur_date).format('DD-MM-YY');
                });
                data.stock_data.data = latestStockData.data || [];
            }
            break;
        case 'metric':
            data.metric = params.metric;
            var metricStockData = await stockDataModel.getMetricStockData(params.metric);
            var dateList = [];
            var stockData = {};
            if (metricStockData.success) {
                metricStockData.data.forEach(function (item) {
                    item.cur_date = moment(item.cur_date).format('DD-MM-YY');
                    if (stockData[item.name] === undefined) {
                        stockData[item.name] = {
                            name: item.name,
                            code: item.code
                        }
                    }
                    if (!stockData[item.name][item.cur_date]) {
                        stockData[item.name][item.cur_date] = item[data.metric];
                    }
                });
                data.stock_data.data = stockData;
            }
            for (var i = 0; i < 30; i++) {
                dateList.push(moment().subtract(i, 'days').format('DD-MM-YY'));
            }
            data.stock_data.date_list = dateList;
            break;
        default: break;
    }

    if (params.search_by == 'by_stock') {
        if (params.stock_name) {

            var data = await stockDataModel.getList(params);
        }
    }
    console.log(data);

    res.render('admin/stocks/stock_download', data);
});

module.exports = router;