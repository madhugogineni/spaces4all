var express = require('express');
var router = express.Router();
var crudModel = require('../../models/crudModel');
router.get('/', async function (req, res) {
    var data = {
        page_name: 'loans',
        page_title: 'Loan Requests',
        loan_requests: []
    };
    var loanRequestResponse = await crudModel.getLoanRequests();
    if (loanRequestResponse.success) {
        data.loan_requests = loanRequestResponse.data;
    }
    res.render('admin/loans', data);
});
router.get('/delete/:id', async function (req, res) {
    var id = req.params.id;
    if (id) {
        await crudModel.deleteLoanRequests(id);
    }
    res.redirect('/admin/loans');
});
module.exports = router;