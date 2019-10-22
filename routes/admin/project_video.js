var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var multer = require("multer");
var deepclone = require('lodash.clonedeep');
var upload = multer();
router.get('/', async function (req, res) {
    var data = {
        page_name: 'project_videos',
        page_title: 'Project Videos',
        side_project_video: {},
        bottom_project_video: {}
    };
    var sideProjectResponse = await crudModel.getProjectVideos('side');
    var bottomProjectResponse = await crudModel.getProjectVideos('bottom');
    if (sideProjectResponse.success) {
        data.side_project_video = sideProjectResponse.data;
    }
    if (bottomProjectResponse.success) {
        data.bottom_project_video = bottomProjectResponse.data;
    }
    res.render('admin/project_video', data);
});
router.post('/update', upload.none(), async function (req, res) {
    var data = deepclone(req.body);
    var type = req.body.type
    if (type) {
        delete data.type;
        await crudModel.updateProjectVideos(data, type);
    }
    res.redirect('/admin/project_videos');
});
module.exports = router;