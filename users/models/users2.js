const Sequelize = require('sequelize');

//const sequelize = require('../../config/services/sqlite-sequelize.service');

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: './database.sqlite'
});

sequelize.authenticate().then(function (err) {
  console.log("connectoin hsa been established");
}).catch(function (err) {
  console.log('unabe to connect ', err);
});


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

exports.findById = function (id, cb) {
  return User.findOne({ where: { id: id } }, cb);
};

exports.createUser = function (data, cb) {
  return User.create(data, cb);
}

exports.patchUser = async function (id, data, cb) {
  let dataToUpdate = await User.findOne({ where: { id: id } });
  dataToUpdate = Object.assign(dataToUpdate, data);;
  return dataToUpdate.save(cb);
}

exports.delete = function (id, cb) {
  return User.destroy({ where: { id } }, cb);
}