const models = require('../models');

const { StoreProfile } = models;

function pickProfilePayload(body) {
  const b = body || {};
  return {
    name: b.name != null ? String(b.name).trim() : '',
    slug: b.slug != null ? String(b.slug).trim() : '',
    description: b.description != null ? String(b.description).trim() : '',
    active: b.active !== undefined ? Boolean(b.active) : true,
    defaultProfile: b.defaultProfile !== undefined ? Boolean(b.defaultProfile) : false,

    // Business configuration (MB-007)
    businessType: b.businessType != null ? String(b.businessType).trim() : undefined,
    businessName: b.businessName != null ? String(b.businessName).trim() : undefined,
    currency: b.currency != null ? String(b.currency).trim() : undefined,
    currencySymbol: b.currencySymbol != null ? String(b.currencySymbol).trim() : undefined,
    locale: b.locale != null ? String(b.locale).trim() : undefined,
    taxId: b.taxId != null ? String(b.taxId).trim() : undefined,
    taxLabel: b.taxLabel != null ? String(b.taxLabel).trim() : undefined,
    address: b.address != null ? String(b.address).trim() : undefined,
    capabilities: b.capabilities || undefined,
    receiptConfig: b.receiptConfig || undefined,
    posConfig: b.posConfig || undefined,
  };
}

exports.list = async function (req, res, next) {
  try {
    const where = {};
    if (req.query.active !== undefined) {
      where.active = req.query.active === 'true' || req.query.active === '1';
    }
    const profiles = await StoreProfile.findAll({
      where,
      order: [['id', 'ASC']],
    });
    res.json(profiles);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const profile = await StoreProfile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Store profile not found' });
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const payload = pickProfilePayload(req.body);
    if (!payload.name || !payload.slug) {
      return res.status(400).json({ error: 'Name and slug are required.' });
    }
    const created = await StoreProfile.create(payload);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const payload = pickProfilePayload(req.body);
    if (!payload.name || !payload.slug) {
      return res.status(400).json({ error: 'Name and slug are required.' });
    }
    const [updated] = await StoreProfile.update(payload, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ error: 'Store profile not found' });
    }
    const profile = await StoreProfile.findByPk(req.params.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await StoreProfile.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ error: 'Store profile not found' });
    }
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};
