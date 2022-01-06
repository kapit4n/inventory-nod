const models = require('../models');

const { Product } = models;

exports.list = async function (req, res) {
  const products = await Product.findAll()
  res.json(products)
}

exports.getById = async function (req, res) {
  const product = await Product.findOne({ where: { id: req.params.id } })
  res.json(product)
}

exports.create = async function (req, res) {
  const created = await Product.create(req.body)
  res.json(created)
}

exports.update = async function (req, res) {
  await Product.update(req.body,  { where: { id: req.params.id } })
  res.json(req.body)
}

exports.delete = async function (req, res) {
  const result = await Product.destroy({ where: { id: req.params.id } })
  res.json(result)
}
