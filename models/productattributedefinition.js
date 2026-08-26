'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductAttributeDefinition extends Model {
    static associate(models) {
      this.belongsTo(models.StoreProfile, { foreignKey: 'storeProfileId', as: 'storeProfile' });
      this.hasMany(models.ProductAttributeValue, { foreignKey: 'productAttributeDefinitionId', as: 'values' });
    }
  }
  ProductAttributeDefinition.init({
    storeProfileId: { type: DataTypes.INTEGER, allowNull: false },
    name:           { type: DataTypes.STRING, allowNull: false },
    code:           { type: DataTypes.STRING, allowNull: false },
    type:           { type: DataTypes.STRING, allowNull: false, defaultValue: 'TEXT' },
    options: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue('options');
        if (!raw) return [];
        try { return JSON.parse(raw); } catch { return []; }
      },
      set(val) {
        this.setDataValue('options', JSON.stringify(val || []));
      },
    },
    required:  { type: DataTypes.BOOLEAN, defaultValue: false },
    active:    { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    sequelize,
    modelName: 'ProductAttributeDefinition',
  });
  return ProductAttributeDefinition;
};
