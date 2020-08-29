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
  console.log(id);
  console.log(User);
  return User.findOne({ where: { id: id } }, cb);
};

exports.createUser = function (data, db) {
  console.log(data);
  return User.create(data, db);
}

exports.patchUser = async function (id, data, db) {
  console.log(data);
  let dataToUpdate = await User.findOne({ where: { id: id } });
  dataToUpdate = Object.assign(dataToUpdate, data);;
  return dataToUpdate.save(db);
}

