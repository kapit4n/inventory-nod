var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/productattributevalues');

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.delete);

module.exports = router;
