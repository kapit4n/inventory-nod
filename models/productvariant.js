'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
      this.hasMany(models.ProductVariantAttributeValue, { foreignKey: 'productVariantId', as: 'attributeLinks' });
    }
  }
  ProductVariant.init({
    productId: { type: DataTypes.INTEGER, allowNull: false },
    name:      { type: DataTypes.STRING },
    sku:       { type: DataTypes.STRING },
    barcode:   { type: DataTypes.STRING },
    price:     { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    cost:      { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    stock:     { type: DataTypes.INTEGER, defaultValue: 0 },
    active:    { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    sequelize,
    modelName: 'ProductVariant',
  });
  return ProductVariant;
};
