const config = require('./config/env.config.js')

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const UsersRouter = require('./users/routes.config');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

app.user(bodyParser.json());
UsersRouter.routesConfig(app);

app.listen(config.port, function () {
  console.log('app listening at port %s', config.port);
})
