'use strict';

/** MB-020: Persist selected variant on order line items. */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderDetails', 'productVariantId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'ProductVariants', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addIndex('OrderDetails', ['productVariantId']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('OrderDetails', ['productVariantId']);
    await queryInterface.removeColumn('OrderDetails', 'productVariantId');
  },
};
