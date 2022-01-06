var express = require('express');
var router = express.Router();

var clientCtrl = require('../controllers/clients')

/* GET clients listing. */
router.get('/', clientCtrl.list);
router.post('/', clientCtrl.create);
router.put('/:id', clientCtrl.update);
router.get('/:id', clientCtrl.getById);
router.delete('/:id', clientCtrl.delete);

module.exports = router;
