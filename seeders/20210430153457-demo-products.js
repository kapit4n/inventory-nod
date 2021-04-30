'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert('Products', [{
      name: 'Orbea',
      // img: 'https://www.orbea.com/img/products/product/large/L271TTCC-NI-SIDE-RALLON_MLTD.jpg',
      price: '3000',
      description: 'Mountain Bike',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Products', null, {});
  }
};
