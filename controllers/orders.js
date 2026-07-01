const models = require('../models');
const { Op } = require('sequelize');
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
    paidCash: Number(b.paidCash) || 0,
    paidQr: Number(b.paidQr) || 0,
    totalDiscount: Number(b.totalDiscount) || 0,
    totalReturn: Number(b.totalReturn) || 0,
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

/** GET /orders/today-summary — aggregate of today's paid orders. */
exports.todaySummary = async function (req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const rows = await Order.findAll({
      where: {
        createdAt: { [Op.gte]: today, [Op.lt]: tomorrow },
        paid: true,
      },
    });

    const summary = rows.reduce(
      (acc, o) => {
        acc.orderCount++;
        acc.totalSales += Number(o.total) || 0;
        acc.totalCash += Number(o.paidCash) || 0;
        acc.totalQr += Number(o.paidQr) || 0;
        acc.totalDiscount += Number(o.totalDiscount) || 0;
        acc.totalReturn += Number(o.totalReturn) || 0;
        return acc;
      },
      {
        date: today.toISOString().split('T')[0],
        orderCount: 0,
        totalSales: 0,
        totalCash: 0,
        totalQr: 0,
        totalDiscount: 0,
        totalReturn: 0,
      }
    );

    res.json(summary);
  } catch (err) {
    next(err);
  }
};
