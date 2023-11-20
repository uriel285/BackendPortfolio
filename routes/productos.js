var express = require('express');
var router = express.Router();

router.get('/productos', function(req,res){
    res.render('productos')
  });

module.exports = router;