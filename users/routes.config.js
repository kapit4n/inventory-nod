const UsersController = require('./controllers/users.controller');
const config = require('../config/env.config')

exports.routesConfig = function (app) {
  applicationCache.post('/users', [
    UsersController.insert
  ]);

  app.get('/users', [
    UsersController.list
  ]);


  app.get('/users/:userId', [
    UsersController.getId
  ]);

  app.patch('/users/:userId', [
    UsersController.patchById
  ]);

  app.delete('/users/:userId', [
    UsersController.removeById
  ]);

};
