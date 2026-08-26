const models = require('../models');
const { ProductAttributeValue, ProductAttributeDefinition } = models;

function pickValuePayload(body) {
  const b = body || {};
  return {
    productAttributeDefinitionId: b.productAttributeDefinitionId != null ? Number(b.productAttributeDefinitionId) : undefined,
    productId: b.productId != null ? Number(b.productId) : undefined,
    value: b.value != null ? String(b.value).trim() : '',
  };
}

exports.list = async function (req, res, next) {
  try {
    const where = {};
    if (req.query.productId) where.productId = Number(req.query.productId);
    if (req.query.productAttributeDefinitionId) where.productAttributeDefinitionId = Number(req.query.productAttributeDefinitionId);
    const values = await ProductAttributeValue.findAll({
      where,
      include: [{ model: ProductAttributeDefinition, as: 'definition', attributes: ['id', 'name', 'code', 'type'] }],
      order: [['id', 'ASC']],
    });
    res.json(values);
  } catch (err) { next(err); }
};

exports.create = async function (req, res, next) {
  try {
    const payload = pickValuePayload(req.body);
    if (!payload.productAttributeDefinitionId || !payload.productId || !payload.value) {
      return res.status(400).json({ error: 'productAttributeDefinitionId, productId, and value are required.' });
    }
    const val = await ProductAttributeValue.create(payload);
    res.status(201).json(val);
  } catch (err) { next(err); }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await ProductAttributeValue.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: 'Attribute value not found' });
    res.json({ deleted: result });
  } catch (err) { next(err); }
};
