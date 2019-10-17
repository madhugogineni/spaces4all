var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'news_letter',
        page_title: 'News Letter'
    };
    var sitesResponse = await crudModel.getNewsLetter();
    if (sitesResponse.success) {
        data.news_letters = sitesResponse.data;
    }
    res.render('admin/news_letter', data);
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteNewsLetter(id);
    }
    res.redirect('/admin/news_letter');
});
module.exports = router;