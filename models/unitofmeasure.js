'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UnitOfMeasure extends Model {
    static associate(models) {
      UnitOfMeasure.belongsToMany(models.Product, {
        through: models.ProductUnitOfMeasure,
        foreignKey: 'unitOfMeasureId',
        otherKey: 'productId',
      });
    }
  }
  UnitOfMeasure.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'UnitOfMeasure',
    }
  );
  return UnitOfMeasure;
};
