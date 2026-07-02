const models = require('../models');
const { AngQuestion } = models;

exports.list = async function (req, res, next) {
  try {
    const questions = await AngQuestion.findAll({ order: [['createdAt', 'DESC']] });
    const parsed = questions.map((q) => ({
      ...q.toJSON(),
      options: JSON.parse(q.options || '[]'),
    }));
    res.json(parsed);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const q = await AngQuestion.findByPk(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    res.json({ ...q.toJSON(), options: JSON.parse(q.options || '[]') });
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const { text, options, complexity, explanation } = req.body;
    const created = await AngQuestion.create({
      text,
      options: JSON.stringify(options || []),
      complexity,
      explanation,
    });
    res.status(201).json({ ...created.toJSON(), options });
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const { text, options, complexity, explanation } = req.body;
    const payload = { text, complexity, explanation };
    if (options) payload.options = JSON.stringify(options);

    const [updated] = await AngQuestion.update(payload, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Question not found' });

    const q = await AngQuestion.findByPk(req.params.id);
    res.json({ ...q.toJSON(), options: JSON.parse(q.options || '[]') });
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await AngQuestion.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: 'Question not found' });
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};
