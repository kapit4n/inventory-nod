var express = require('express');
var router = express.Router();

var cashierCtrl = require('../controllers/cashiers')

/* GET cashiers listing. */
router.get('/', cashierCtrl.list);
router.post('/', cashierCtrl.create);
router.put('/:id', cashierCtrl.update);
router.get('/:id', cashierCtrl.getById);
router.delete('/:id', cashierCtrl.delete);

module.exports = router;
