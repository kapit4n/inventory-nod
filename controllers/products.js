const models = require('../models');

const { Product, ProductUnitOfMeasure, UnitOfMeasure, Category, Vendor } = models;

const productInclude = [
  { model: Category, required: false },
  { model: Vendor, required: false },
  { model: UnitOfMeasure, through: { attributes: [] } },
];

function sanitizeProductAttributes(body) {
  const o = { ...(body || {}) };
  delete o.UnitOfMeasures;
  delete o.unitOfMeasureIds;
  delete o.Category;
  delete o.Vendor;
  delete o.ProductPresentations;
  delete o.productPresentations;
  return o;
}

async function replaceProductUnitLinks(productId, unitOfMeasureIds) {
  if (!Array.isArray(unitOfMeasureIds)) {
    return;
  }
  const ids = [...new Set(unitOfMeasureIds.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0))];
  await ProductUnitOfMeasure.destroy({ where: { productId } });
  if (!ids.length) {
    return;
  }
  await ProductUnitOfMeasure.bulkCreate(
    ids.map((unitOfMeasureId) => ({
      productId,
      unitOfMeasureId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
}

exports.list = async function (req, res, next) {
  try {
    const products = await Product.findAll({
      include: productInclude,
      order: [['id', 'ASC']],
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
      include: productInclude,
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const { unitOfMeasureIds, ...rest } = req.body || {};
    const created = await Product.create(sanitizeProductAttributes(rest));
    await replaceProductUnitLinks(created.id, unitOfMeasureIds);
    const full = await Product.findByPk(created.id, { include: productInclude });
    res.json(full);
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const { unitOfMeasureIds, ...rest } = req.body || {};
    const id = req.params.id;
    const [updated] = await Product.update(sanitizeProductAttributes(rest), { where: { id } });
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (unitOfMeasureIds !== undefined) {
      await replaceProductUnitLinks(id, unitOfMeasureIds);
    }
    const full = await Product.findByPk(id, { include: productInclude });
    res.json(full);
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await Product.destroy({ where: { id: req.params.id } });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
