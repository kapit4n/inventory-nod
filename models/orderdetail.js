'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      OrderDetail.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
      OrderDetail.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
  }

  OrderDetail.init(
    {
      orderId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      quantity: DataTypes.FLOAT,
      price: DataTypes.FLOAT,
      discount: DataTypes.FLOAT,
      totalPrice: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'OrderDetail',
    }
  );
  return OrderDetail;
};
