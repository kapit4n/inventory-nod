const models = require('../models');
const { UnitOfMeasure } = models;

function pickUomBody(body) {
  const code = body && body.code != null ? String(body.code).trim().toUpperCase() : '';
  const name = body && body.name != null ? String(body.name).trim() : '';
  return { code, name };
}

exports.list = async function (req, res, next) {
  try {
    const rows = await UnitOfMeasure.findAll({ order: [['code', 'ASC']] });
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const row = await UnitOfMeasure.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Unit of measure not found' });
    }
    res.json(row);
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const { code, name } = pickUomBody(req.body);
    if (!code || !name) {
      return res.status(400).json({ error: 'Both `code` and `name` are required (JSON body).' });
    }
    const created = await UnitOfMeasure.create({ code, name });
    res.status(201).json(created);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'A unit with this code already exists.' });
    }
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const { code, name } = pickUomBody(req.body);
    if (!code || !name) {
      return res.status(400).json({ error: 'Both `code` and `name` are required (JSON body).' });
    }
    const [updated] = await UnitOfMeasure.update(
      { code, name },
      { where: { id: req.params.id } }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Unit of measure not found' });
    }
    const row = await UnitOfMeasure.findByPk(req.params.id);
    res.json(row);
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await UnitOfMeasure.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ error: 'Unit of measure not found' });
    }
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};
