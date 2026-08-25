'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CatalogTemplateProduct extends Model {
    static associate(models) {
      this.belongsTo(models.CatalogTemplate, { foreignKey: 'catalogTemplateId', as: 'template' });
      this.belongsTo(models.CatalogTemplateCategory, { foreignKey: 'catalogTemplateCategoryId', as: 'category' });
    }
  }
  CatalogTemplateProduct.init({
    catalogTemplateId: { type: DataTypes.INTEGER, allowNull: false },
    catalogTemplateCategoryId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
    img: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    uom: { type: DataTypes.STRING, defaultValue: 'UNIT' },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    sequelize,
    modelName: 'CatalogTemplateProduct',
  });
  return CatalogTemplateProduct;
};
