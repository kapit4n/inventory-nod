const models = require('../models');

const { Category } = models;

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
    const created = await Category.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const [updated] = await Category.update(req.body, { where: { id: req.params.id } });
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
