'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    static associate(models) {
      this.hasMany(models.Product, { foreignKey: 'vendorId' });
    }
  }
  Vendor.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      contact: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Vendor',
    }
  );
  return Vendor;
};
