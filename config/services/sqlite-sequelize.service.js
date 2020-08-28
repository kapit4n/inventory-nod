const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: './database.sqlite'
});

sequelize.authenticate().then(function (err) {
  console.log("connectoin hsa been established");
}).catch(function (err) {
  console.log('unabe to connect ', err);
});

exports.sequelize = sequelize;

// this should go to models
var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  permissionLevel: {
    type: Sequelize.NUMBER
  },
});

// this will go to model
User.sync({ force: true }).then(function () {
  return User.create({
    firstName: 'Ramiro',
    lastName: 'Ponce'
  });
});
