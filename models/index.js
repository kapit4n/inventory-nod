'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configAll = require(__dirname + '/../config/config.json');
const config = configAll[env] || configAll.development;
const db = {};

if (!config) {
  throw new Error(`Database config missing for NODE_ENV="${env}" and no development entry in config/config.json`);
}

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else if (config.dialect === 'sqlite') {
  const storagePath = path.isAbsolute(config.storage)
    ? config.storage
    : path.join(__dirname, '..', config.storage);
  /**
   * SQLite file locking: default Sequelize pool (max 5) opens multiple sqlite3
   * handles on one file → SQLITE_BUSY / pool acquire timeouts under concurrent API use.
   * Single pooled connection + WAL + busy_timeout matches SQLite’s single-writer model.
   */
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
    pool: {
      max: 1,
      min: 0,
      acquire: 120000,
      idle: 10000,
    },
    retry: {
      max: 8,
      match: [
        'SQLITE_BUSY: database is locked',
        /SQLITE_BUSY/i,
        /database is locked/i,
      ],
    },
    hooks: {
      afterConnect: async (connection) => {
        await new Promise((resolve, reject) => {
          connection.exec(
            'PRAGMA journal_mode=WAL; PRAGMA busy_timeout=30000; PRAGMA synchronous=NORMAL;',
            (err) => (err ? reject(err) : resolve())
          );
        });
      },
    },
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
