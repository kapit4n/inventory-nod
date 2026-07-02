'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AngQuestion extends Model {
    static associate(models) {
      AngQuestion.hasMany(models.AngExamAnswer, { foreignKey: 'questionId', as: 'answers' });
    }
  }

  AngQuestion.init(
    {
      text: DataTypes.STRING,
      options: DataTypes.TEXT,
      complexity: DataTypes.STRING,
      explanation: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'AngQuestion',
    }
  );

  return AngQuestion;
};
