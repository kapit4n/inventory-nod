'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AngExam extends Model {
    static associate(models) {
      AngExam.hasMany(models.AngExamResult, { foreignKey: 'examId', as: 'results' });
    }
  }

  AngExam.init(
    {
      title: DataTypes.STRING,
      questionIds: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'AngExam',
    }
  );

  return AngExam;
};
