'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InventoryLot extends Model {
    static associate(models) {
      InventoryLot.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
    }
  }

  InventoryLot.init(
    {
      productId: DataTypes.INTEGER,
      expiryDate: DataTypes.DATEONLY,
      quantity: DataTypes.FLOAT,
      batchCode: DataTypes.STRING,
      receivedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'InventoryLot',
    }
  );

  return InventoryLot;
};
