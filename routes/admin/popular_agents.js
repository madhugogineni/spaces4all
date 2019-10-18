var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'popular_agents',
        page_title: 'Useful Contacts',
        agents: []
    };
    var agentsResponse = await crudModel.getPopularAgents();
    if (agentsResponse.success) {
        data.agents = agentsResponse.data;
    }
    res.render('admin/popular_agents', data);
});
router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await crudModel.addPopularAgents(data);
    res.redirect('/admin/popular_agents');
})
router.post('/update', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    var id = req.body.agent_id;
    if (id) {
        data.company = data.company1;
        data.name = data.name1;
        data.phone = data.phone1;
        data.category = data.category1;
        data.city = data.city1;
        delete data.company1;
        delete data.name1;
        delete data.phone1;
        delete data.category1;
        delete data.city1;
        delete data.agent_id;
        await crudModel.updatePopularAgents(data, id);
    }
    res.redirect('/admin/popular_agents');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deletePopularAgents(id);
    }
    res.redirect('/admin/popular_agents');
});
module.exports = router;