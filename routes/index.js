var express = require('express');
var router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Inventory resources goes here' });
});

module.exports = router;
