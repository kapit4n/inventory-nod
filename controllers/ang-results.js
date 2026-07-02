const models = require('../models');
const { AngExamResult, AngExamAnswer, AngExam, AngQuestion } = models;

exports.list = async function (req, res, next) {
  try {
    const results = await AngExamResult.findAll({
      order: [['completedAt', 'DESC']],
    });
    res.json(results);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const result = await AngExamResult.findByPk(req.params.id);
    if (!result) return res.status(404).json({ error: 'Result not found' });

    const answers = await AngExamAnswer.findAll({
      where: { resultId: result.id },
    });

    const parsedAnswers = answers.map((a) => ({
      ...a.toJSON(),
      selectedOptions: JSON.parse(a.selectedOptions || '[]'),
      correctOptions: JSON.parse(a.correctOptions || '[]'),
    }));

    res.json({
      ...result.toJSON(),
      answers: parsedAnswers,
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const { examId, examTitle, score, total, completedAt, answers } = req.body;

    const created = await AngExamResult.create({
      examId,
      examTitle,
      score,
      total,
      completedAt: completedAt || new Date().toISOString(),
    });

    if (answers && answers.length) {
      const answerRows = answers.map((a) => ({
        resultId: created.id,
        questionId: a.questionId,
        questionText: a.questionText,
        selectedOptions: JSON.stringify(a.selectedOptions || []),
        correctOptions: JSON.stringify(a.correctOptions || []),
        isCorrect: a.isCorrect,
      }));
      await AngExamAnswer.bulkCreate(answerRows);
    }

    const saved = await exports.getById({ params: { id: created.id } }, res, () => {});
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await AngExamResult.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};
