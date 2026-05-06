'use strict';

const { Op } = require('sequelize');
const models = require('../models');
const { runExclusive } = require('./inventory-mutation-queue');
const { sequelize, Product, InventoryLot } = models;

function parseAmount(raw, fallback = 0) {
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return fallback;
  }
  return n;
}

function parseDateOnly(raw) {
  if (raw == null || typeof raw !== 'string') {
    return null;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) {
    return null;
  }
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo || dt.getUTCDate() !== d) {
    return null;
  }
  return `${y}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function defaultExpiryFromShelfLife(days) {
  const n = Number(days);
  if (!Number.isFinite(n) || n < 0) {
    return null;
  }
  const now = new Date();
  const t = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + Math.floor(n));
  const dt = new Date(t);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
}

function resolveExpiryDate(product, expiryDateRaw) {
  const fromQuery = parseDateOnly(String(expiryDateRaw || '').trim());
  if (fromQuery) {
    return fromQuery;
  }
  return defaultExpiryFromShelfLife(product.defaultShelfLifeDays);
}

/**
 * Add stock. When product.trackExpiry is true, creates an InventoryLot (requires expiryDate query
 * or product.defaultShelfLifeDays).
 */
async function receive(productId, amount, { expiryDate: expiryDateRaw, batchCode } = {}) {
  return runExclusive(() => receiveImpl(productId, amount, { expiryDate: expiryDateRaw, batchCode }));
}

async function receiveImpl(productId, amount, { expiryDate: expiryDateRaw, batchCode } = {}) {
  const t = await sequelize.transaction();
  try {
    const p = await Product.findByPk(productId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!p) {
      await t.rollback();
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    const amt = Math.max(0, parseAmount(amount, 0));
    if (!amt) {
      await t.commit();
      return p;
    }

    p.stock = parseAmount(p.stock, 0) + amt;
    await p.save({ transaction: t });

    if (p.trackExpiry) {
      const exp = resolveExpiryDate(p, expiryDateRaw);
      if (!exp) {
        await t.rollback();
        const err = new Error(
          'When trackExpiry is true, provide expiryDate (YYYY-MM-DD) or set defaultShelfLifeDays on the product'
        );
        err.status = 400;
        throw err;
      }
      await InventoryLot.create(
        {
          productId,
          quantity: amt,
          expiryDate: exp,
          batchCode: batchCode || null,
          receivedAt: new Date(),
        },
        { transaction: t }
      );
    }

    await t.commit();
    return Product.findByPk(productId);
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

/**
 * Reduce stock. When product.trackExpiry is true, consumes lots first-expiry-first (FEFO).
 */
async function reduce(productId, amount) {
  return runExclusive(() => reduceImpl(productId, amount));
}

async function reduceImpl(productId, amount) {
  const t = await sequelize.transaction();
  try {
    const p = await Product.findByPk(productId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!p) {
      await t.rollback();
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    const cur = parseAmount(p.stock, 0);
    const toReduce = Math.min(Math.max(0, parseAmount(amount, 0)), cur);
    if (!toReduce) {
      await t.commit();
      return p;
    }

    if (p.trackExpiry) {
      const lots = await InventoryLot.findAll({
        where: { productId, quantity: { [Op.gt]: 0 } },
        order: [
          ['expiryDate', 'ASC'],
          ['id', 'ASC'],
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      let rem = toReduce;
      for (const lot of lots) {
        if (rem <= 0) {
          break;
        }
        const q = Math.max(0, parseAmount(lot.quantity, 0));
        const d = Math.min(q, rem);
        const next = q - d;
        rem -= d;
        if (next <= 0) {
          await lot.destroy({ transaction: t });
        } else {
          lot.quantity = next;
          await lot.save({ transaction: t });
        }
      }
    }

    p.stock = Math.max(0, cur - toReduce);
    await p.save({ transaction: t });
    await t.commit();
    return Product.findByPk(productId);
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

module.exports = {
  receive,
  reduce,
  parseAmount,
  parseDateOnly,
};
