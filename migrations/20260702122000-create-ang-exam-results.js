'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AngExamResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      examId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'AngExams', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      examTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: false,
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

    await queryInterface.createTable('AngExamAnswers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      resultId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'AngExamResults', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'AngQuestions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      questionText: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      selectedOptions: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'JSON array of selected option indices',
      },
      correctOptions: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'JSON array of correct option indices',
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex('AngExamAnswers', ['resultId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('AngExamAnswers');
    await queryInterface.dropTable('AngExamResults');
  },
};
