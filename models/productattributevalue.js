'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductAttributeValue extends Model {
    static associate(models) {
      this.belongsTo(models.ProductAttributeDefinition, { foreignKey: 'productAttributeDefinitionId', as: 'definition' });
      this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
      this.hasMany(models.ProductVariantAttributeValue, { foreignKey: 'productAttributeValueId', as: 'variantLinks' });
    }
  }
  ProductAttributeValue.init({
    productAttributeDefinitionId: { type: DataTypes.INTEGER, allowNull: false },
    productId:                    { type: DataTypes.INTEGER, allowNull: false },
    value:                        { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'ProductAttributeValue',
  });
  return ProductAttributeValue;
};
