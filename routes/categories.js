var express = require('express');
var router = express.Router();

var categoryCtrl = require('../controllers/categories')

/* GET categories listing. */
router.get('/', categoryCtrl.list);
router.post('/', categoryCtrl.create);
router.put('/:id', categoryCtrl.update);
router.get('/:id', categoryCtrl.getById);
router.delete('/:id', categoryCtrl.delete);

module.exports = router;
