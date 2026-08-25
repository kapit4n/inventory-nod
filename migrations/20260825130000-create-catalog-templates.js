'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) CatalogTemplates — defines a reusable business catalog
    await queryInterface.createTable('CatalogTemplates', {
      id:           { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name:         { type: Sequelize.STRING, allowNull: false },
      slug:         { type: Sequelize.STRING, allowNull: false, unique: true },
      description:  { type: Sequelize.STRING },
      businessType: { type: Sequelize.STRING, allowNull: false },
      active:       { type: Sequelize.BOOLEAN, defaultValue: true },

      // Default business config applied when template is used
      capabilities: { type: Sequelize.TEXT },
      receiptConfig: { type: Sequelize.TEXT },
      posConfig: { type: Sequelize.TEXT },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // 2) CatalogTemplateCategories — categories within a template
    await queryInterface.createTable('CatalogTemplateCategories', {
      id:                { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      catalogTemplateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'CatalogTemplates', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name:        { type: Sequelize.STRING, allowNull: false },
      code:        { type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      sortOrder:   { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt:   { allowNull: false, type: Sequelize.DATE },
      updatedAt:   { allowNull: false, type: Sequelize.DATE },
    });

    // 3) CatalogTemplateProducts — products within a template
    await queryInterface.createTable('CatalogTemplateProducts', {
      id:                { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      catalogTemplateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'CatalogTemplates', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      catalogTemplateCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'CatalogTemplateCategories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name:        { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      code:        { type: Sequelize.STRING },
      img:         { type: Sequelize.STRING },
      price:       { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      cost:        { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      uom:         { type: Sequelize.STRING, defaultValue: 'UNIT' },
      stock:       { type: Sequelize.INTEGER, defaultValue: 0 },
      sortOrder:   { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt:   { allowNull: false, type: Sequelize.DATE },
      updatedAt:   { allowNull: false, type: Sequelize.DATE },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CatalogTemplateProducts');
    await queryInterface.dropTable('CatalogTemplateCategories');
    await queryInterface.dropTable('CatalogTemplates');
  },
};
