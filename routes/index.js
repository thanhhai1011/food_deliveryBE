var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify("index", { title: "Express" }));
});

module.exports = router;
