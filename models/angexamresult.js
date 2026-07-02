'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AngExamResult extends Model {
    static associate(models) {
      AngExamResult.belongsTo(models.AngExam, { foreignKey: 'examId', as: 'exam' });
      AngExamResult.hasMany(models.AngExamAnswer, { foreignKey: 'resultId', as: 'answers' });
    }
  }

  AngExamResult.init(
    {
      examId: DataTypes.INTEGER,
      examTitle: DataTypes.STRING,
      score: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      completedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'AngExamResult',
    }
  );

  return AngExamResult;
};
