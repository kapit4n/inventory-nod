var express = require('express');
var router = express.Router();

var productCtrl = require('../controllers/products')

/* GET products listing. */
router.get('/', productCtrl.list);
router.get('/addToInventory', productCtrl.addToInventory);
router.get('/reduceInventory', productCtrl.reduceInventory);
router.get('/updateTotalSelled', productCtrl.updateTotalSelled);
router.get('/updateQuantitySelled', productCtrl.updateQuantitySelled);
router.post('/', productCtrl.create);
router.put('/:id', productCtrl.update);
router.get('/:id', productCtrl.getById);
router.delete('/:id', productCtrl.delete);

module.exports = router;
