const models = require('../models');
const stockOps = require('../lib/inventory-stock-ops');

const { InventoryLot, Product } = models;

function num(raw, fallback = 0) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function parseProductId(req) {
  const raw = req.query.productId;
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  return id;
}

exports.list = async function (req, res, next) {
  try {
    const productId = parseProductId(req);
    if (!productId) {
      return res.status(400).json({ error: 'productId query parameter is required' });
    }
    const rows = await InventoryLot.findAll({
      where: { productId },
      order: [
        ['expiryDate', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    res.json(rows.map((r) => r.get({ plain: true })));
  } catch (err) {
    next(err);
  }
};

/** POST { productId, quantity, expiryDate?, batchCode? } — adds stock + optional lot (same rules as addToInventory). */
exports.create = async function (req, res, next) {
  try {
    const b = req.body || {};
    const productId = Number(b.productId);
    if (!Number.isFinite(productId) || productId <= 0) {
      return res.status(400).json({ error: 'productId is required' });
    }
    const quantity = Math.max(0, num(b.quantity, 0));
    if (!quantity) {
      return res.status(400).json({ error: 'quantity must be > 0' });
    }
    const updated = await stockOps.receive(productId, quantity, {
      expiryDate: b.expiryDate,
      batchCode: b.batchCode,
    });
    res.json(updated.get({ plain: true }));
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const row = await InventoryLot.findByPk(id, { include: [{ model: Product, required: false }] });
    if (!row) {
      return res.status(404).json({ error: 'Inventory lot not found' });
    }
    res.json(row.get({ plain: true }));
  } catch (err) {
    next(err);
  }
};

/** DELETE — removes lot and decreases product.stock by lot quantity. */
exports.delete = async function (req, res, next) {
  const { sequelize } = models;
  const t = await sequelize.transaction();
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid id' });
    }
    const lot = await InventoryLot.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!lot) {
      await t.rollback();
      return res.status(404).json({ error: 'Inventory lot not found' });
    }
    const p = await Product.findByPk(lot.productId, { transaction: t, lock: t.LOCK.UPDATE });
    const q = stockOps.parseAmount(lot.quantity, 0);
    if (p) {
      p.stock = Math.max(0, stockOps.parseAmount(p.stock, 0) - q);
      await p.save({ transaction: t });
    }
    await lot.destroy({ transaction: t });
    await t.commit();
    res.json({ ok: true, id });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
