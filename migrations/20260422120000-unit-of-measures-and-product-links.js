'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UnitOfMeasures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    const now = new Date();
    await queryInterface.bulkInsert('UnitOfMeasures', [
      { code: 'UNIT', name: 'Unit (each)', createdAt: now, updatedAt: now },
      { code: 'BOX', name: 'Box', createdAt: now, updatedAt: now },
      { code: 'PACK', name: 'Pack', createdAt: now, updatedAt: now },
      { code: 'KG', name: 'Kilogram', createdAt: now, updatedAt: now },
      { code: 'G', name: 'Gram', createdAt: now, updatedAt: now },
      { code: 'L', name: 'Liter', createdAt: now, updatedAt: now },
      { code: 'ML', name: 'Milliliter', createdAt: now, updatedAt: now },
    ]);

    await queryInterface.createTable('ProductUnitOfMeasures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      unitOfMeasureId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'UnitOfMeasures', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('ProductUnitOfMeasures', ['productId', 'unitOfMeasureId'], {
      unique: true,
      name: 'uniq_product_unit_of_measure',
    });

    await queryInterface.addColumn('ProductPresentations', 'unitOfMeasureId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'UnitOfMeasures', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ProductPresentations', 'unitOfMeasureId');
    await queryInterface.dropTable('ProductUnitOfMeasures');
    await queryInterface.dropTable('UnitOfMeasures');
  },
};
