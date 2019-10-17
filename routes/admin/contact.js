var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/', async function (req, res) {
    var data = {
        page_title: 'Contact Us',
        page_name: 'contact',
        contacts: []
    };
    var contactsResponse = await crudModel.getContacts();
    if (contactsResponse.success) {
        data.contacts = contactsResponse.data;
    }
    res.render('admin/contact', data);
});
router.get('/delete/:id', async function(req,res) {
    var id = req.params.id;
    if(id) {
        await crudModel.deleteContact(id);
    }
    res.redirect('/admin/contact');
})
module.exports = router;