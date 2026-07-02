const models = require('../models');
const { AngExam, AngQuestion } = models;

exports.list = async function (req, res, next) {
  try {
    const exams = await AngExam.findAll({ order: [['createdAt', 'DESC']] });
    const parsed = exams.map((e) => ({
      ...e.toJSON(),
      questionIds: JSON.parse(e.questionIds || '[]'),
    }));
    res.json(parsed);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const e = await AngExam.findByPk(req.params.id);
    if (!e) return res.status(404).json({ error: 'Exam not found' });

    const examJson = e.toJSON();
    const questionIds = JSON.parse(examJson.questionIds || '[]');

    const questions = await AngQuestion.findAll({
      where: { id: questionIds },
    });

    const questionMap = {};
    for (const q of questions) {
      questionMap[q.id] = { ...q.toJSON(), options: JSON.parse(q.options || '[]') };
    }

    res.json({
      ...examJson,
      questionIds,
      questions: questionIds.map((id) => questionMap[id]).filter(Boolean),
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const { title, questionIds } = req.body;
    const created = await AngExam.create({
      title,
      questionIds: JSON.stringify(questionIds || []),
    });
    res.status(201).json({ ...created.toJSON(), questionIds: questionIds || [] });
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const { title, questionIds } = req.body;
    const payload = { title };
    if (questionIds) payload.questionIds = JSON.stringify(questionIds);

    const [updated] = await AngExam.update(payload, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Exam not found' });

    const e = await AngExam.findByPk(req.params.id);
    res.json({ ...e.toJSON(), questionIds: JSON.parse(e.questionIds || '[]') });
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await AngExam.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: 'Exam not found' });
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};
