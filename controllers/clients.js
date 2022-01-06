const models = require('../models');

const { Client } = models;

exports.list = async function (req, res) {
  const clients = await Client.findAll()
  res.json(clients)
}

exports.getById = async function (req, res) {
  const client = await Client.findOne({ where: { id: req.params.id } })
  res.json(client)
}

exports.create = async function (req, res) {
  const created = await Client.create(req.body)
  res.json(created)
}

exports.update = async function (req, res) {
  await Client.update(req.body,  { where: { id: req.params.id } })
  res.json(req.body)
}

exports.delete = async function (req, res) {
  const result = await Client.destroy({ where: { id: req.params.id } })
  res.json(result)
}
