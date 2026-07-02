var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/ang-results');

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.delete('/:id', ctrl.delete);

module.exports = router;
