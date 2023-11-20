var express = require('express');
var router = express.Router();

router.get('/acerca', function(req,res){
    res.render('acerca')
  });

module.exports = router;