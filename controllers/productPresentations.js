const models = require('../models');

const { ProductPresentation, ProductUnitOfMeasure, UnitOfMeasure, Product } = models;

function sanitizePresentationBody(body) {
  const o = { ...(body || {}) };
  delete o.Product;
  delete o.UnitOfMeasure;
  return o;
}

async function syncUnitLabelFromId(productId, unitOfMeasureId, fallbackUnitString) {
  if (!unitOfMeasureId) {
    return { unitOfMeasureId: null, unitOfMeasure: (fallbackUnitString || '').trim() };
  }
  const idNum = Number(unitOfMeasureId);
  if (!Number.isFinite(idNum) || idNum <= 0) {
    return { unitOfMeasureId: null, unitOfMeasure: (fallbackUnitString || '').trim() };
  }

  const allowed = await ProductUnitOfMeasure.findOne({
    where: { productId, unitOfMeasureId: idNum },
  });
  const countForProduct = await ProductUnitOfMeasure.count({ where: { productId } });
  if (countForProduct > 0 && !allowed) {
    const err = new Error('Selected unit is not allowed for this product. Add it on the product form first.');
    err.status = 400;
    throw err;
  }

  const uom = await UnitOfMeasure.findByPk(idNum);
  if (!uom) {
    const err = new Error('Unit of measure not found');
    err.status = 400;
    throw err;
  }
  return {
    unitOfMeasureId: idNum,
    unitOfMeasure: uom.name || uom.code || String(idNum),
  };
}

exports.list = async function (req, res, next) {
  try {
    const productPresentations = await ProductPresentation.findAll({
      include: [{ all: true, nested: true }],
      order: [['id', 'ASC']],
    });
    res.json(productPresentations);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const productPresentation = await ProductPresentation.findOne({
      where: { id: req.params.id },
      include: [{ all: true, nested: true }],
    });
    if (!productPresentation) {
      return res.status(404).json({ error: 'Product presentation not found' });
    }
    res.json(productPresentation);
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const body = sanitizePresentationBody(req.body);
    const productId = Number(body.productId);
    const sync = await syncUnitLabelFromId(
      productId,
      body.unitOfMeasureId,
      body.unitOfMeasure
    );
    const created = await ProductPresentation.create({
      ...body,
      ...sync,
    });
    const full = await ProductPresentation.findByPk(created.id, {
      include: [{ all: true, nested: true }],
    });
    res.json(full);
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const id = req.params.id;
    const body = sanitizePresentationBody(req.body);
    const productId = Number(body.productId);
    if (body.unitOfMeasureId !== undefined || body.unitOfMeasure !== undefined) {
      const sync = await syncUnitLabelFromId(
        productId,
        body.unitOfMeasureId,
        body.unitOfMeasure
      );
      Object.assign(body, sync);
    }
    await ProductPresentation.update(body, { where: { id } });
    const full = await ProductPresentation.findByPk(id, {
      include: [{ all: true, nested: true }],
    });
    res.json(full || body);
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await ProductPresentation.destroy({ where: { id: req.params.id } });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
