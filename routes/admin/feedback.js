var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'feedbacks',
        page_title: 'Feedbacks',
        feedbacks: []
    };
    var feedbackResponse = await crudModel.getFeedback();
    if (feedbackResponse.success) {
        data.feedbacks = feedbackResponse.data;
    }
    res.render('admin/feedback', data);
});
router.get('/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        var feedbackResponse = await crudModel.getFeedbackById(id);
        res.send(feedbackResponse);
    } else {
        res.send({success: false, message: 'Invalid Feeback'});
    }
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteFeedback(id);
    }
    res.redirect('/admin/feedback');
})

module.exports = router;