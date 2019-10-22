var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    var data = {
        page_name: 'mail_templates',
        page_title: 'Mail Templates'
    };
    res.render('admin/mail_templates', data);
});
router.get('/load', function (req, res) {

});
module.exports = router;