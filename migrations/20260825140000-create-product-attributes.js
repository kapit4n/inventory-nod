'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) ProductAttributeDefinitions — what attributes exist per business
    await queryInterface.createTable('ProductAttributeDefinitions', {
      id:              { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      storeProfileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'StoreProfiles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name:       { type: Sequelize.STRING, allowNull: false },
      code:       { type: Sequelize.STRING, allowNull: false },
      type:       { type: Sequelize.STRING, allowNull: false, defaultValue: 'TEXT' }, // TEXT, NUMBER, SELECT, BOOLEAN
      options:    { type: Sequelize.TEXT }, // JSON array for SELECT type: ["Red","Blue","Green"]
      required:   { type: Sequelize.BOOLEAN, defaultValue: false },
      active:     { type: Sequelize.BOOLEAN, defaultValue: true },
      sortOrder:  { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt:  { allowNull: false, type: Sequelize.DATE },
      updatedAt:  { allowNull: false, type: Sequelize.DATE },
    });

    // 2) ProductAttributeValues — actual attribute values on specific products
    await queryInterface.createTable('ProductAttributeValues', {
      id:                           { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      productAttributeDefinitionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ProductAttributeDefinitions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      value:     { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // 3) ProductVariants — a specific combination of attribute values (e.g., T-Shirt XL Red)
    await queryInterface.createTable('ProductVariants', {
      id:        { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name:      { type: Sequelize.STRING },
      sku:       { type: Sequelize.STRING },
      barcode:   { type: Sequelize.STRING },
      price:     { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      cost:      { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      stock:     { type: Sequelize.INTEGER, defaultValue: 0 },
      active:    { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // 4) ProductVariantAttributeValues — junction: links variant to its attribute values
    await queryInterface.createTable('ProductVariantAttributeValues', {
      id:                    { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      productVariantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ProductVariants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      productAttributeValueId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ProductAttributeValues', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // Indexes
    await queryInterface.addIndex('ProductAttributeDefinitions', ['storeProfileId']);
    await queryInterface.addIndex('ProductAttributeValues', ['productId']);
    await queryInterface.addIndex('ProductAttributeValues', ['productAttributeDefinitionId']);
    await queryInterface.addIndex('ProductVariants', ['productId']);
    await queryInterface.addIndex('ProductVariants', ['sku']);
    await queryInterface.addIndex('ProductVariants', ['barcode']);
    await queryInterface.addIndex('ProductVariantAttributeValues', ['productVariantId']);
    await queryInterface.addIndex('ProductVariantAttributeValues', ['productAttributeValueId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProductVariantAttributeValues');
    await queryInterface.dropTable('ProductVariants');
    await queryInterface.dropTable('ProductAttributeValues');
    await queryInterface.dropTable('ProductAttributeDefinitions');
  },
};
