var express = require('express');
var router = express.Router();

var ordersCtrl = require('../controllers/orders');

router.get('/', ordersCtrl.list);
router.post('/', ordersCtrl.create);

module.exports = router;
