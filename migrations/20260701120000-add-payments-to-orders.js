'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'paidCash', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Orders', 'paidQr', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Orders', 'totalDiscount', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Orders', 'totalReturn', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Orders', 'totalReturn');
    await queryInterface.removeColumn('Orders', 'totalDiscount');
    await queryInterface.removeColumn('Orders', 'paidQr');
    await queryInterface.removeColumn('Orders', 'paidCash');
  },
};
