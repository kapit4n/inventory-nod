'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreProfile extends Model {
    static associate(models) {
      this.hasMany(models.Product, { foreignKey: 'storeProfileId', as: 'products' });
      this.hasMany(models.Category, { foreignKey: 'storeProfileId', as: 'categories' });
    }
  }
  StoreProfile.init({
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    defaultProfile: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Business configuration (MB-007)
    businessType: { type: DataTypes.STRING, defaultValue: 'supermarket' },
    businessName: { type: DataTypes.STRING },
    currency: { type: DataTypes.STRING, defaultValue: 'BOB' },
    currencySymbol: { type: DataTypes.STRING, defaultValue: 'Bs' },
    locale: { type: DataTypes.STRING, defaultValue: 'es-BO' },
    taxId: { type: DataTypes.STRING },
    taxLabel: { type: DataTypes.STRING, defaultValue: 'NIT' },
    address: { type: DataTypes.STRING },

    // JSON fields stored as TEXT for SQLite compatibility
    capabilities: {
      type: DataTypes.TEXT,
      defaultValue: '["BARCODE","DISCOUNTS","CUSTOMERS"]',
      get() {
        const raw = this.getDataValue('capabilities');
        if (!raw) return ['BARCODE', 'DISCOUNTS', 'CUSTOMERS'];
        try { return JSON.parse(raw); } catch { return ['BARCODE', 'DISCOUNTS', 'CUSTOMERS']; }
      },
      set(val) {
        this.setDataValue('capabilities', JSON.stringify(val || ['BARCODE', 'DISCOUNTS', 'CUSTOMERS']));
      },
    },
    receiptConfig: {
      type: DataTypes.TEXT,
      defaultValue: '{"paperWidth":80,"headerLines":[],"footerLines":[]}',
      get() {
        const raw = this.getDataValue('receiptConfig');
        if (!raw) return { paperWidth: 80, headerLines: [], footerLines: [] };
        try { return JSON.parse(raw); } catch { return { paperWidth: 80, headerLines: [], footerLines: [] }; }
      },
      set(val) {
        this.setDataValue('receiptConfig', JSON.stringify(val || { paperWidth: 80, headerLines: [], footerLines: [] }));
      },
    },
    posConfig: {
      type: DataTypes.TEXT,
      defaultValue: '{"catalogColumns":4,"showProductImages":true,"quickProducts":[],"defaultSellingMode":"UNIT"}',
      get() {
        const raw = this.getDataValue('posConfig');
        if (!raw) return { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' };
        try { return JSON.parse(raw); } catch { return { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' }; }
      },
      set(val) {
        this.setDataValue('posConfig', JSON.stringify(val || { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' }));
      },
    },
  }, {
    sequelize,
    modelName: 'StoreProfile',
  });
  return StoreProfile;
};
