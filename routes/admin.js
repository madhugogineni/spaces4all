var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.redirect("login");
});
router.get("/login",function(req,res) {
  res.send("welcome");
});

module.exports = router;
