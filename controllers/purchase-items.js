const models = require('../models');
const { PurchaseItem, Product } = models;

const includeProduct = [{ model: Product, as: 'product', required: false }];

function num(raw, fallback = 0) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function parseProductIdFilter(req) {
  // Supports Angular service: filter[where][productId]=<id>
  const raw = req.query['filter[where][productId]'];
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  return id;
}

exports.list = async function (req, res, next) {
  try {
    const productId = parseProductIdFilter(req);
    const where = productId ? { productId } : undefined;
    const rows = await PurchaseItem.findAll({
      where,
      include: includeProduct,
      order: [['createdAt', 'DESC']],
    });
    res.json(rows.map((r) => r.get({ plain: true })));
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const b = req.body || {};
    const productId = Number(b.productId);
    if (!Number.isFinite(productId) || productId <= 0) {
      return res.status(400).json({ error: 'productId is required' });
    }
    const quantity = num(b.quantity, 0);
    const price = num(b.price, 0);
    const totalPrice = Number.isFinite(Number(b.totalPrice)) ? num(b.totalPrice, 0) : quantity * price;

    const created = await PurchaseItem.create({
      productId,
      quantity,
      price,
      totalPrice,
    });
    const full = await PurchaseItem.findByPk(created.id, { include: includeProduct });
    res.json(full.get({ plain: true }));
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const b = req.body || {};
    const quantity = num(b.quantity, 0);
    const price = num(b.price, 0);
    const totalPrice = Number.isFinite(Number(b.totalPrice)) ? num(b.totalPrice, 0) : quantity * price;
    const [updated] = await PurchaseItem.update(
      { quantity, price, totalPrice },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Purchase item not found' });
    }
    const full = await PurchaseItem.findByPk(id, { include: includeProduct });
    res.json(full.get({ plain: true }));
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const result = await PurchaseItem.destroy({ where: { id } });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

