var express = require('express');
var router = express.Router();
var ctrl = require('../controllers/ang-questions');

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.post('/dedup', ctrl.dedup);

router.put('/:id', ctrl.update);
router.get('/:id', ctrl.getById);
router.delete('/:id', ctrl.delete);

module.exports = router;
