var express = require('express');
var router = express.Router();

var ctrl = require('../controllers/purchase-items');

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;

