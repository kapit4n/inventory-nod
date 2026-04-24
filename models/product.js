'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Vendor, {
        foreignKey: 'vendorId',
        onDelete: 'SET NULL',
      });
      this.belongsToMany(models.UnitOfMeasure, {
        through: models.ProductUnitOfMeasure,
        foreignKey: 'productId',
        otherKey: 'unitOfMeasureId',
      });
    }
  };
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    code: DataTypes.STRING,
    img: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    vendorId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};