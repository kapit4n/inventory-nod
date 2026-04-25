const models = require('../models');

const { Client } = models;

function pickClientPayload(body) {
  const b = body || {};
  return {
    name: b.name != null ? String(b.name).trim() : '',
    code: b.code != null ? String(b.code).trim() : '',
    address: b.address != null ? String(b.address).trim() : '',
  };
}

exports.list = async function (req, res, next) {
  try {
    const clients = await Client.findAll({ order: [['id', 'ASC']] });
    res.json(clients);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const payload = pickClientPayload(req.body);
    if (!payload.name || !payload.code) {
      return res.status(400).json({ error: 'Name and code are required.' });
    }
    const created = await Client.create(payload);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const payload = pickClientPayload(req.body);
    if (!payload.name || !payload.code) {
      return res.status(400).json({ error: 'Name and code are required.' });
    }
    const [updated] = await Client.update(payload, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ error: 'Client not found' });
    }
    const client = await Client.findByPk(req.params.id);
    res.json(client);
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await Client.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};
