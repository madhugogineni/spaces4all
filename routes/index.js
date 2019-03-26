var express = require('express');
var router = express.Router();
var crudModel = require("../models/crudModel");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/', function (req, res, next) {

});

module.exports = router;
