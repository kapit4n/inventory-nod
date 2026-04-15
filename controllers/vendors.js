const models = require('../models');
const { Vendor } = models;

exports.list = async function (req, res, next) {
  try {
    const vendors = await Vendor.findAll({ order: [['id', 'ASC']] });
    res.json(vendors);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const created = await Vendor.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const [updated] = await Vendor.update(req.body, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    const vendor = await Vendor.findByPk(req.params.id);
    res.json(vendor);
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await Vendor.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};
