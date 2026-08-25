'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add business configuration columns to StoreProfiles.
    // All columns are nullable with defaults so existing rows are unaffected.

    await queryInterface.addColumn('StoreProfiles', 'businessType', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'supermarket',
    });

    await queryInterface.addColumn('StoreProfiles', 'businessName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('StoreProfiles', 'currency', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'BOB',
    });

    await queryInterface.addColumn('StoreProfiles', 'currencySymbol', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Bs',
    });

    await queryInterface.addColumn('StoreProfiles', 'locale', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'es-BO',
    });

    await queryInterface.addColumn('StoreProfiles', 'taxId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('StoreProfiles', 'taxLabel', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'NIT',
    });

    await queryInterface.addColumn('StoreProfiles', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('StoreProfiles', 'capabilities', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('StoreProfiles', 'receiptConfig', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('StoreProfiles', 'posConfig', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Backfill existing rows with sensible defaults
    const now = new Date();
    await queryInterface.sequelize.query(
      `UPDATE StoreProfiles
       SET businessType = 'supermarket',
           currency = 'BOB',
           currencySymbol = 'Bs',
           locale = 'es-BO',
           taxLabel = 'NIT',
           capabilities = '["BARCODE","DISCOUNTS","CUSTOMERS"]',
           receiptConfig = '{"paperWidth":80,"headerLines":[],"footerLines":[]}',
           posConfig = '{"catalogColumns":4,"showProductImages":true,"quickProducts":[],"defaultSellingMode":"UNIT"}'
       WHERE businessType IS NULL`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('StoreProfiles', 'posConfig');
    await queryInterface.removeColumn('StoreProfiles', 'receiptConfig');
    await queryInterface.removeColumn('StoreProfiles', 'capabilities');
    await queryInterface.removeColumn('StoreProfiles', 'address');
    await queryInterface.removeColumn('StoreProfiles', 'taxLabel');
    await queryInterface.removeColumn('StoreProfiles', 'taxId');
    await queryInterface.removeColumn('StoreProfiles', 'locale');
    await queryInterface.removeColumn('StoreProfiles', 'currencySymbol');
    await queryInterface.removeColumn('StoreProfiles', 'currency');
    await queryInterface.removeColumn('StoreProfiles', 'businessName');
    await queryInterface.removeColumn('StoreProfiles', 'businessType');
  },
};
