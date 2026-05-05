'use strict';

/** Store expiry / batch on purchase lines so inventory history matches lots. */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('PurchaseItems', 'expiryDate', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }),
      queryInterface.addColumn('PurchaseItems', 'batchCode', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface) => {
    await Promise.all([
      queryInterface.removeColumn('PurchaseItems', 'batchCode'),
      queryInterface.removeColumn('PurchaseItems', 'expiryDate'),
    ]);
  },
};
