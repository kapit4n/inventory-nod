const models = require('../models');
const { ProductVariant, ProductVariantAttributeValue, ProductAttributeValue, ProductAttributeDefinition } = models;

function pickVariantPayload(body) {
  const b = body || {};
  return {
    productId: b.productId != null ? Number(b.productId) : undefined,
    name: b.name != null ? String(b.name).trim() : '',
    sku: b.sku != null ? String(b.sku).trim() : '',
    barcode: b.barcode != null ? String(b.barcode).trim() : '',
    price: b.price != null ? Number(b.price) : 0,
    cost: b.cost != null ? Number(b.cost) : 0,
    stock: b.stock != null ? Number(b.stock) : 0,
    active: b.active !== undefined ? Boolean(b.active) : true,
  };
}

exports.list = async function (req, res, next) {
  try {
    const where = {};
    if (req.query.productId) where.productId = Number(req.query.productId);
    if (req.query.active !== undefined) where.active = req.query.active === 'true' || req.query.active === '1';
    const variants = await ProductVariant.findAll({
      where,
      include: [{
        model: ProductVariantAttributeValue,
        as: 'attributeLinks',
        include: [{
          model: ProductAttributeValue,
          as: 'attributeValue',
          include: [{ model: ProductAttributeDefinition, as: 'definition', attributes: ['id', 'name', 'code', 'type'] }],
        }],
      }],
      order: [['id', 'ASC']],
    });
    res.json(variants);
  } catch (err) { next(err); }
};

exports.getById = async function (req, res, next) {
  try {
    const variant = await ProductVariant.findByPk(req.params.id, {
      include: [{
        model: ProductVariantAttributeValue,
        as: 'attributeLinks',
        include: [{
          model: ProductAttributeValue,
          as: 'attributeValue',
          include: [{ model: ProductAttributeDefinition, as: 'definition', attributes: ['id', 'name', 'code', 'type'] }],
        }],
      }],
    });
    if (!variant) return res.status(404).json({ error: 'Variant not found' });
    res.json(variant);
  } catch (err) { next(err); }
};

exports.create = async function (req, res, next) {
  try {
    const payload = pickVariantPayload(req.body);
    if (!payload.productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }
    const t = await models.sequelize.transaction();
    try {
      const variant = await ProductVariant.create(payload, { transaction: t });

      const attrValues = req.body.attributeValues || [];
      for (const avId of attrValues) {
        await ProductVariantAttributeValue.create({
          productVariantId: variant.id,
          productAttributeValueId: avId,
        }, { transaction: t });
      }

      await t.commit();
      const result = await ProductVariant.findByPk(variant.id, {
        include: [{
          model: ProductVariantAttributeValue,
          as: 'attributeLinks',
          include: [{
            model: ProductAttributeValue,
            as: 'attributeValue',
            include: [{ model: ProductAttributeDefinition, as: 'definition', attributes: ['id', 'name', 'code', 'type'] }],
          }],
        }],
      });
      res.status(201).json(result);
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (err) { next(err); }
};

exports.update = async function (req, res, next) {
  try {
    const payload = pickVariantPayload(req.body);
    const t = await models.sequelize.transaction();
    try {
      const [updated] = await ProductVariant.update(payload, { where: { id: req.params.id }, transaction: t });
      if (!updated) {
        await t.rollback();
        return res.status(404).json({ error: 'Variant not found' });
      }

      if (req.body.attributeValues !== undefined) {
        await ProductVariantAttributeValue.destroy({ where: { productVariantId: req.params.id }, transaction: t });
        for (const avId of req.body.attributeValues) {
          await ProductVariantAttributeValue.create({
            productVariantId: Number(req.params.id),
            productAttributeValueId: avId,
          }, { transaction: t });
        }
      }

      await t.commit();
      const variant = await ProductVariant.findByPk(req.params.id, {
        include: [{
          model: ProductVariantAttributeValue,
          as: 'attributeLinks',
          include: [{
            model: ProductAttributeValue,
            as: 'attributeValue',
            include: [{ model: ProductAttributeDefinition, as: 'definition', attributes: ['id', 'name', 'code', 'type'] }],
          }],
        }],
      });
      res.json(variant);
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (err) { next(err); }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await ProductVariant.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: 'Variant not found' });
    res.json({ deleted: result });
  } catch (err) { next(err); }
};
