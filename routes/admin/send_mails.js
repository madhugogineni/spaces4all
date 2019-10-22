var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
var fs = require('fs');
var multer = require('multer');
var upload = multer();
var utils = require('../../services/utils');
var urls = require('../../external-config/url-config');
var emails = require('../../services/email');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'send_mails',
        page_title: 'Send Mails',
        projects: []
    };
    var response = await crudModel.getProjectNames();
    if (response.success) {
        data.projects = response.data;
    }
    res.render('admin/send_mails', data);
});
router.post('/', upload.none(), async function (req, res) {
    var response = await crudModel.getProjectByIds(req.body.projects.toString());
    if (response.success) {
        var data = response.data;
        for (var i = 0; i < data.length; i++) {
            var project = data[i];
            var formattedPrice = utils.getPrice({min_price: project.min_price, max_price: project.max_price}, true)
            project.min_price_formatted = formattedPrice.min_price;
            project.max_price_formatted = formattedPrice.max_price;
            if (project.project_photo == null) {
                project.project_photo = "no-photo.jpg";
            }
            var path = urls.base_url + "uploads/projects/" + project.project_photo;
            if (!fs.existsSync(path)) {
                project.project_photo = "no-photo.jpg";
            }
        }
    }
    var returnString = utils.getTemplateForMail('project_mail_template.ejs', {projects: data});
    // console.log(returnString);
    emails.sendMail(req.body.subject, returnString, req.body.to_mails);
    res.redirect('/admin')

});
module.exports = router;