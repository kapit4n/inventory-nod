const models = require('../models');
const { ProductAttributeDefinition, ProductAttributeValue, StoreProfile } = models;

function pickDefPayload(body) {
  const b = body || {};
  return {
    storeProfileId: b.storeProfileId != null ? Number(b.storeProfileId) : undefined,
    name: b.name != null ? String(b.name).trim() : '',
    code: b.code != null ? String(b.code).trim().toUpperCase() : '',
    type: b.type != null ? String(b.type).trim().toUpperCase() : 'TEXT',
    options: b.options || undefined,
    required: b.required !== undefined ? Boolean(b.required) : false,
    active: b.active !== undefined ? Boolean(b.active) : true,
    sortOrder: b.sortOrder != null ? Number(b.sortOrder) : 0,
  };
}

exports.list = async function (req, res, next) {
  try {
    const where = {};
    if (req.query.storeProfileId) where.storeProfileId = Number(req.query.storeProfileId);
    if (req.query.active !== undefined) where.active = req.query.active === 'true' || req.query.active === '1';
    const defs = await ProductAttributeDefinition.findAll({
      where,
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    });
    res.json(defs);
  } catch (err) { next(err); }
};

exports.getById = async function (req, res, next) {
  try {
    const def = await ProductAttributeDefinition.findByPk(req.params.id, {
      include: [
        { model: ProductAttributeValue, as: 'values', attributes: ['id', 'productId', 'value'] },
      ],
    });
    if (!def) return res.status(404).json({ error: 'Attribute definition not found' });
    res.json(def);
  } catch (err) { next(err); }
};

exports.create = async function (req, res, next) {
  try {
    const payload = pickDefPayload(req.body);
    if (!payload.storeProfileId || !payload.name || !payload.code) {
      return res.status(400).json({ error: 'storeProfileId, name, and code are required.' });
    }
    const def = await ProductAttributeDefinition.create(payload);
    res.status(201).json(def);
  } catch (err) { next(err); }
};

exports.update = async function (req, res, next) {
  try {
    const payload = pickDefPayload(req.body);
    const [updated] = await ProductAttributeDefinition.update(payload, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Attribute definition not found' });
    const def = await ProductAttributeDefinition.findByPk(req.params.id);
    res.json(def);
  } catch (err) { next(err); }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await ProductAttributeDefinition.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: 'Attribute definition not found' });
    res.json({ deleted: result });
  } catch (err) { next(err); }
};
