'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AngQuestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      options: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'JSON array of {text, correct}',
      },
      complexity: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'basic | intermediate | advanced',
      },
      explanation: {
        type: Sequelize.TEXT,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('AngQuestions');
  },
};
