var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/unitOfMeasures');

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
