var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'project_sub_type',
        page_title: 'Project Sub Type',
        project_sub_types: []
    }
    var projectSubTypeResponse = await crudModel.getProjectSubTypes();
    if (projectSubTypeResponse.success) {
        data.project_sub_types = projectSubTypeResponse.data;
    }
    res.render('admin/project/project_sub_type', data);
});

router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await crudModel.addProjectSubType(data);
    res.redirect('/admin/project_sub_type');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteProjectSubType(id);
    }
    res.redirect('/admin/project_sub_type');
});
router.post('/update', upload.none(), async function (req, res) {
    if (req.body.project_sub_type_id && req.body.sub_type1) {
        var data = deepclone(req.body);
        data.sub_type = data.sub_type1;
        data.project_type_id = data.project_type_id1;
        delete data.sub_type1;
        delete data.project_type_id1;
        await crudModel.updateProjectSubType(data, req.body.project_sub_type_id);
    }
    res.redirect('/admin/project_sub_type');
});
module.exports = router;