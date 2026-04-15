var express = require('express');
var router = express.Router();

var vendorCtrl = require('../controllers/vendors');

router.get('/', vendorCtrl.list);
router.post('/', vendorCtrl.create);
router.put('/:id', vendorCtrl.update);
router.get('/:id', vendorCtrl.getById);
router.delete('/:id', vendorCtrl.delete);

module.exports = router;
