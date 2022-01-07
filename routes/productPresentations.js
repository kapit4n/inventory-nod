var express = require('express');
var router = express.Router();

var productPresentationCtrl = require('../controllers/productPresentations')

/* GET productPresentations listing. */
router.get('/', productPresentationCtrl.list);
router.post('/', productPresentationCtrl.create);
router.put('/:id', productPresentationCtrl.update);
router.get('/:id', productPresentationCtrl.getById);
router.delete('/:id', productPresentationCtrl.delete);

module.exports = router;
