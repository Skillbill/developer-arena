const express = require('express');
const router = express.Router({mergeParams: true});

router.get('/', function(req, res) {
  res.send({
    welcome: res.__('welcome')
  });
});

module.exports = router;
