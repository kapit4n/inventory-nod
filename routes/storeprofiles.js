var express = require('express');
var router = express.Router();

var storeProfileCtrl = require('../controllers/storeprofiles');

router.get('/', storeProfileCtrl.list);
router.get('/:id', storeProfileCtrl.getById);
router.post('/', storeProfileCtrl.create);
router.put('/:id', storeProfileCtrl.update);
router.delete('/:id', storeProfileCtrl.delete);

module.exports = router;
