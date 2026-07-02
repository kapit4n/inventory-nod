'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AngExamAnswer extends Model {
    static associate(models) {
      AngExamAnswer.belongsTo(models.AngExamResult, { foreignKey: 'resultId', as: 'result' });
      AngExamAnswer.belongsTo(models.AngQuestion, { foreignKey: 'questionId', as: 'question' });
    }
  }

  AngExamAnswer.init(
    {
      resultId: DataTypes.INTEGER,
      questionId: DataTypes.INTEGER,
      questionText: DataTypes.STRING,
      selectedOptions: DataTypes.TEXT,
      correctOptions: DataTypes.TEXT,
      isCorrect: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'AngExamAnswer',
    }
  );

  return AngExamAnswer;
};
