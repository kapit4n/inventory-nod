'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseItem extends Model {
    static associate(models) {
      PurchaseItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });
    }
  }

  PurchaseItem.init(
    {
      productId: DataTypes.INTEGER,
      quantity: DataTypes.FLOAT,
      price: DataTypes.FLOAT,
      totalPrice: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'PurchaseItem',
    }
  );

  return PurchaseItem;
};

