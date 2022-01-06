const models = require('../models');

const { Category } = models;

exports.list = async function (req, res) {
  const categories = await Category.findAll()
  res.json(categories)
}

exports.getById = async function (req, res) {
  const category = await Category.findOne({ where: { id: req.params.id } })
  res.json(category)
}

exports.create = async function (req, res) {
  const created = await Category.create(req.body)
  res.json(created)
}

exports.update = async function (req, res) {
  await Category.update(req.body,  { where: { id: req.params.id } })
  res.json(req.body)
}

exports.delete = async function (req, res) {
  const result = await Category.destroy({ where: { id: req.params.id } })
  res.json(result)
}
