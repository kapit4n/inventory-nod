const models = require('../models');
const { Order, Client } = models;

function pickOrderBody(body, customerId) {
  const b = body || {};
  return {
    customerId,
    total: Number(b.total) || 0,
    description: b.description != null ? String(b.description) : '',
    paid: Boolean(b.paid),
    delivered: Boolean(b.delivered),
    deliveryDate: b.deliveryDate ? new Date(b.deliveryDate) : null,
  };
}

/** Only persist FK when a matching Client exists (POS "Anonymous" id 1 often has no row). */
async function resolveCustomerIdForFk(raw) {
  if (raw == null || raw === '') {
    return null;
  }
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  const row = await Client.findByPk(id);
  return row ? id : null;
}

exports.list = async function (req, res, next) {
  try {
    const rows = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json(rows.map((r) => r.get({ plain: true })));
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const customerId = await resolveCustomerIdForFk((req.body || {}).customerId);
    const created = await Order.create(pickOrderBody(req.body, customerId));
    const plain = created.get({ plain: true });
    res.json({ ...plain, id: created.id });
  } catch (err) {
    next(err);
  }
};
