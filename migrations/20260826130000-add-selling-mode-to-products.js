'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'sellingMode', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'UNIT',
      after: 'defaultShelfLifeDays',
    });

    await queryInterface.addColumn('OrderDetails', 'unitLabel', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'totalPrice',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Products', 'sellingMode');
    await queryInterface.removeColumn('OrderDetails', 'unitLabel');
  },
};
