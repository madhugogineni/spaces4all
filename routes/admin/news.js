var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
var utils = require('../../services/utils');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'news',
        page_title: 'News',
        news: []
    };
    var newsResponse = await crudModel.getNews();
    if (newsResponse.success) {
        data.news = newsResponse.data;
    }
    res.render('admin/news/news', data);
});
router.get('/add', upload.none(), async function (req, res) {
    var data = {
        page_name: 'add_news',
        page_title: 'Add News'
    };
    res.render('admin/news/add_news', data);
});
router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    console.log(data);
    data.datetime = utils.getDate();
    await crudModel.addNews(data);
    res.redirect('/admin/news');
});
router.get('/edit/:id', upload.none(), async function (req, res) {
    var id = req.params.id;
    if (id) {
        var data = {
            page_name: 'news_details',
            page_title: 'News Details',
            news: null,
            news_id: null
        };
        var newsResponse = await crudModel.getNewsById(id);
        if (newsResponse.success) {
            data.news = newsResponse.data;
            data.news_id = id;
            console.log(data);
            res.render('admin/news/edit_news', data)
        } else {
            res.redirect('/admin/news');
        }
    } else {
        res.redirect('/admin/news');
    }
});
router.post('/update/:id', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    var id = req.params.id;
    if (id) {
        await crudModel.updateNews(data, id);
    }
    res.redirect('/admin/news');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteNews(id);
    }
    res.redirect('/admin/news');
})
module.exports = router;