const models = require('../models');

const { Category } = models;

function pickCategoryPayload(body) {
  const b = body || {};
  return {
    name: b.name != null ? String(b.name).trim() : '',
    code: b.code != null ? String(b.code).trim() : '',
    description: b.description != null ? String(b.description).trim() : '',
    img: b.img != null ? String(b.img).trim() : '',
  };
}

exports.list = async function (req, res, next) {
  try {
    const categories = await Category.findAll({ order: [['id', 'ASC']] });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const payload = pickCategoryPayload(req.body);
    if (!payload.name || !payload.code) {
      return res.status(400).json({ error: 'Name and code are required.' });
    }
    const created = await Category.create(payload);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const payload = pickCategoryPayload(req.body);
    if (!payload.name || !payload.code) {
      return res.status(400).json({ error: 'Name and code are required.' });
    }
    const [updated] = await Category.update(payload, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const category = await Category.findByPk(req.params.id);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await Category.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};
