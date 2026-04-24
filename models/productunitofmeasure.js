'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductUnitOfMeasure extends Model {
    static associate(models) {
      ProductUnitOfMeasure.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
      ProductUnitOfMeasure.belongsTo(models.UnitOfMeasure, {
        foreignKey: 'unitOfMeasureId',
        onDelete: 'CASCADE',
      });
    }
  }
  ProductUnitOfMeasure.init(
    {
      productId: DataTypes.INTEGER,
      unitOfMeasureId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ProductUnitOfMeasure',
    }
  );
  return ProductUnitOfMeasure;
};
