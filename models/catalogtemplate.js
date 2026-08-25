'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CatalogTemplate extends Model {
    static associate(models) {
      this.hasMany(models.CatalogTemplateCategory, { foreignKey: 'catalogTemplateId', as: 'categories' });
      this.hasMany(models.CatalogTemplateProduct, { foreignKey: 'catalogTemplateId', as: 'products' });
    }
  }
  CatalogTemplate.init({
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING },
    businessType: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },

    capabilities: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue('capabilities');
        if (!raw) return [];
        try { return JSON.parse(raw); } catch { return []; }
      },
      set(val) {
        this.setDataValue('capabilities', JSON.stringify(val || []));
      },
    },
    receiptConfig: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue('receiptConfig');
        if (!raw) return { paperWidth: 80, headerLines: [], footerLines: [] };
        try { return JSON.parse(raw); } catch { return { paperWidth: 80, headerLines: [], footerLines: [] }; }
      },
      set(val) {
        this.setDataValue('receiptConfig', JSON.stringify(val || {}));
      },
    },
    posConfig: {
      type: DataTypes.TEXT,
      get() {
        const raw = this.getDataValue('posConfig');
        if (!raw) return { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' };
        try { return JSON.parse(raw); } catch { return { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' }; }
      },
      set(val) {
        this.setDataValue('posConfig', JSON.stringify(val || {}));
      },
    },
  }, {
    sequelize,
    modelName: 'CatalogTemplate',
  });
  return CatalogTemplate;
};
