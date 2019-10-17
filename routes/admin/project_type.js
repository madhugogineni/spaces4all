var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'project_type',
        page_title: 'Project Type',
        project_types: []
    }
    var projectTypeResponse = await crudModel.getProjectType();
    if (projectTypeResponse.success) {
        data.project_types = projectTypeResponse.data;
    }
    res.render('admin/project/project_type', data);
});

router.post('/add', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    await crudModel.addProjectType(data);
    res.redirect('/admin/project_type');
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteProjectType(id);
    }
    res.redirect('/admin/project_type');
});
router.post('/update', upload.none(), async function (req, res) {
    if (req.body.type1 && req.body.project_type_id) {
        var data = deepclone(req.body);
        data.type = data.type1;
        delete data.type1;
        delete data.project_type_id;
        await crudModel.updateProjectType(data, req.body.project_type_id);
    }
    res.redirect('/admin/project_type');
});
module.exports = router;