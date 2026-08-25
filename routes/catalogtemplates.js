var express = require('express');
var router = express.Router();

var catalogTemplateCtrl = require('../controllers/catalogtemplates');

router.get('/', catalogTemplateCtrl.list);
router.get('/:id', catalogTemplateCtrl.getById);
router.post('/', catalogTemplateCtrl.create);
router.put('/:id', catalogTemplateCtrl.update);
router.delete('/:id', catalogTemplateCtrl.delete);
router.post('/:id/apply', catalogTemplateCtrl.apply);

module.exports = router;
