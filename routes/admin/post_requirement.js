var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'post_requirement',
        page_title: 'Post Requirement',
        post_requirements: []
    };
    var postRequirementsResponse = await crudModel.getPostRequirements();
    if (postRequirementsResponse.success) {
        data.post_requirements = postRequirementsResponse.data;
    }
    res.render('admin/post_requirement', data);
});
router.get('/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        var postRequirementResponse = await crudModel.getPostRequirementById(id);
        res.send(postRequirementResponse);
    } else {
        res.send({success: false});
    }

});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deletePostRequirement(id);
    }
    res.redirect('/admin/post_requirement');
});
module.exports = router;