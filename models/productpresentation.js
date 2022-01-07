'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductPresentation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      })
    }
  };
  ProductPresentation.init({
    unitOfMeasure: DataTypes.STRING,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    brand: DataTypes.STRING,
    currentPrice: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'ProductPresentation',
  });
  return ProductPresentation;
};