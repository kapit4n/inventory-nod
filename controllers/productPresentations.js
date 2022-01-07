const models = require('../models');

const { ProductPresentation } = models;

exports.list = async function (req, res) {
  const productPresentations = await ProductPresentation.findAll({ include: { all: true } })
  res.json(productPresentations)
}

exports.getById = async function (req, res) {
  const productPresentation = await ProductPresentation.findOne({ where: { id: req.params.id }, include: { all: true } })
  res.json(productPresentation)
}

exports.create = async function (req, res) {
  const created = await ProductPresentation.create(req.body)
  res.json(created)
}

exports.update = async function (req, res) {
  await ProductPresentation.update(req.body,  { where: { id: req.params.id } })
  res.json(req.body)
}

exports.delete = async function (req, res) {
  const result = await ProductPresentation.destroy({ where: { id: req.params.id } })
  res.json(result)
}
