const models = require('../models');

const { Cashier } = models;

exports.list = async function (req, res) {
  const clients = await Cashier.findAll()
  res.json(clients)
}

exports.getById = async function (req, res) {
  const client = await Cashier.findOne({ where: { id: req.params.id } })
  res.json(client)
}

exports.create = async function (req, res) {
  const created = await Cashier.create(req.body)
  res.json(created)
}

exports.update = async function (req, res) {
  await Cashier.update(req.body,  { where: { id: req.params.id } })
  res.json(req.body)
}

exports.delete = async function (req, res) {
  const result = await Cashier.destroy({ where: { id: req.params.id } })
  res.json(result)
}
