'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'vendorId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Vendors', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Products', 'vendorId');
  },
};
