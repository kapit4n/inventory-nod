var express = require('express');
var router = express.Router();

var orderDetailsCtrl = require('../controllers/orderDetails');

router.get('/', orderDetailsCtrl.list);
router.post('/', orderDetailsCtrl.create);

module.exports = router;
