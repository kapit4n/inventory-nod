'use strict';

/** Inventory management fields + purchase-items history. */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('Products', 'stock', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.addColumn('Products', 'cost', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.addColumn('Products', 'price', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.addColumn('Products', 'totalSelled', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.addColumn('Products', 'quantitySelled', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      }),
    ]);

    await queryInterface.createTable('PurchaseItems', {
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
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex('PurchaseItems', ['productId']);
    await queryInterface.addIndex('PurchaseItems', ['createdAt']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('PurchaseItems');
    await Promise.all([
      queryInterface.removeColumn('Products', 'quantitySelled'),
      queryInterface.removeColumn('Products', 'totalSelled'),
      queryInterface.removeColumn('Products', 'price'),
      queryInterface.removeColumn('Products', 'cost'),
      queryInterface.removeColumn('Products', 'stock'),
    ]);
  },
};

