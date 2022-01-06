'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return Promise.all([
      queryInterface.addColumn(
        'Products',
        'code',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
      ),
      queryInterface.addColumn(
        'Products',
        'categoryId',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     // logic for reverting the changes
     return Promise.all([
      queryInterface.removeColumn('Products', 'categoryId'),
      queryInterface.removeColumn('Products', 'code'),
    ]);
  }
};
