var express = require('express');
var router = express.Router();
var crudModel = require("../models/crudModel");

router.get('/', function (req, res, next) {
  // crudModel.getPlotDetails(5).then(function (response) {
  //   console.log(response);
  // });
  // console.log("----------------------");
  // crudModel.getPropertyId("spaces", "spaces4all@gmail.com", 4, 7, 1, 7, "2015-11-29 01:03:23").then(function (response) {
  //   console.log(response);
  // });
  res.render('index', { title: 'Express' });
});

module.exports = router;