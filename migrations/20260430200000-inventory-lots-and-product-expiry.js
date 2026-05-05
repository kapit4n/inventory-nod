'use strict';

/** Per-product expiry tracking + FEFO lots (minimarket). */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('Products', 'trackExpiry', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn('Products', 'defaultShelfLifeDays', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);

    await queryInterface.createTable('InventoryLots', {
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
      expiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      batchCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      receivedAt: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex('InventoryLots', ['productId']);
    await queryInterface.addIndex('InventoryLots', ['expiryDate']);
    await queryInterface.addIndex('InventoryLots', ['productId', 'expiryDate']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('InventoryLots');
    await Promise.all([
      queryInterface.removeColumn('Products', 'defaultShelfLifeDays'),
      queryInterface.removeColumn('Products', 'trackExpiry'),
    ]);
  },
};
