'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Client, { foreignKey: 'customerId', as: 'client' });
      Order.hasMany(models.OrderDetail, { foreignKey: 'orderId', as: 'OrderDetails' });
    }
  }

  Order.init(
    {
      customerId: DataTypes.INTEGER,
      total: DataTypes.FLOAT,
      description: DataTypes.STRING,
      paid: DataTypes.BOOLEAN,
      delivered: DataTypes.BOOLEAN,
      deliveryDate: DataTypes.DATE,
      paidCash: DataTypes.FLOAT,
      paidQr: DataTypes.FLOAT,
      totalDiscount: DataTypes.FLOAT,
      totalReturn: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
