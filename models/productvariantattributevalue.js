'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariantAttributeValue extends Model {
    static associate(models) {
      this.belongsTo(models.ProductVariant, { foreignKey: 'productVariantId', as: 'variant' });
      this.belongsTo(models.ProductAttributeValue, { foreignKey: 'productAttributeValueId', as: 'attributeValue' });
    }
  }
  ProductVariantAttributeValue.init({
    productVariantId:       { type: DataTypes.INTEGER, allowNull: false },
    productAttributeValueId: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    sequelize,
    modelName: 'ProductVariantAttributeValue',
  });
  return ProductVariantAttributeValue;
};
