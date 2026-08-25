'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CatalogTemplateCategory extends Model {
    static associate(models) {
      this.belongsTo(models.CatalogTemplate, { foreignKey: 'catalogTemplateId', as: 'template' });
      this.hasMany(models.CatalogTemplateProduct, { foreignKey: 'catalogTemplateCategoryId', as: 'products' });
    }
  }
  CatalogTemplateCategory.init({
    catalogTemplateId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    sequelize,
    modelName: 'CatalogTemplateCategory',
  });
  return CatalogTemplateCategory;
};
