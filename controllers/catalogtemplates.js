const models = require('../models');
const { CatalogTemplate, CatalogTemplateCategory, CatalogTemplateProduct, StoreProfile, Category, Product, ProductPresentation, ProductUnitOfMeasure } = models;

function pickTemplatePayload(body) {
  const b = body || {};
  return {
    name: b.name != null ? String(b.name).trim() : '',
    slug: b.slug != null ? String(b.slug).trim() : '',
    description: b.description != null ? String(b.description).trim() : '',
    businessType: b.businessType != null ? String(b.businessType).trim() : '',
    active: b.active !== undefined ? Boolean(b.active) : true,
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
    if (req.query.businessType) {
      where.businessType = req.query.businessType;
    }
    const templates = await CatalogTemplate.findAll({
      where,
      order: [['id', 'ASC']],
    });
    res.json(templates);
  } catch (err) {
    next(err);
  }
};

exports.getById = async function (req, res, next) {
  try {
    const template = await CatalogTemplate.findByPk(req.params.id, {
      include: [
        { model: CatalogTemplateCategory, as: 'categories', order: [['sortOrder', 'ASC']] },
        { model: CatalogTemplateProduct, as: 'products', order: [['sortOrder', 'ASC']] },
      ],
    });
    if (!template) {
      return res.status(404).json({ error: 'Catalog template not found' });
    }
    res.json(template);
  } catch (err) {
    next(err);
  }
};

exports.create = async function (req, res, next) {
  try {
    const payload = pickTemplatePayload(req.body);
    if (!payload.name || !payload.slug || !payload.businessType) {
      return res.status(400).json({ error: 'Name, slug, and businessType are required.' });
    }
    const created = await CatalogTemplate.create(payload);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async function (req, res, next) {
  try {
    const payload = pickTemplatePayload(req.body);
    if (!payload.name || !payload.slug || !payload.businessType) {
      return res.status(400).json({ error: 'Name, slug, and businessType are required.' });
    }
    const [updated] = await CatalogTemplate.update(payload, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ error: 'Catalog template not found' });
    }
    const template = await CatalogTemplate.findByPk(req.params.id);
    res.json(template);
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  try {
    const result = await CatalogTemplate.destroy({ where: { id: req.params.id } });
    if (!result) {
      return res.status(404).json({ error: 'Catalog template not found' });
    }
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};

// POST /catalogTemplates/:id/apply
// Creates a new StoreProfile from the template, copying categories and products.
exports.apply = async function (req, res, next) {
  try {
    const template = await CatalogTemplate.findByPk(req.params.id, {
      include: [
        { model: CatalogTemplateCategory, as: 'categories' },
        { model: CatalogTemplateProduct, as: 'products' },
      ],
    });
    if (!template) {
      return res.status(404).json({ error: 'Catalog template not found' });
    }

    const t = await models.sequelize.transaction();
    try {
      const profilePayload = {
        name: req.body.name || template.name,
        slug: req.body.slug || template.slug + '-' + Date.now(),
        description: req.body.description || template.description,
        active: true,
        defaultProfile: false,
        businessType: template.businessType,
        businessName: req.body.businessName || template.name,
        currency: template.capabilities ? undefined : undefined,
        capabilities: template.capabilities,
        receiptConfig: template.receiptConfig,
        posConfig: template.posConfig,
      };

      // Allow caller to override business config
      const overrides = ['businessName', 'currency', 'currencySymbol', 'locale', 'taxId', 'taxLabel', 'address'];
      for (const key of overrides) {
        if (req.body[key] !== undefined) profilePayload[key] = req.body[key];
      }

      const profile = await StoreProfile.create(profilePayload, { transaction: t });

      const catIdMap = new Map();
      for (const tmplCat of template.categories) {
        const cat = await Category.create({
          name: tmplCat.name,
          code: tmplCat.code ? tmplCat.code + '-' + profile.id : 'CAT-' + profile.id + '-' + (catIdMap.size + 1),
          description: tmplCat.description,
          img: '',
          storeProfileId: profile.id,
        }, { transaction: t });
        catIdMap.set(tmplCat.id, cat.id);
      }

      let prodCount = 0;
      for (const tmplProd of template.products) {
        const catId = tmplProd.catalogTemplateCategoryId
          ? catIdMap.get(tmplProd.catalogTemplateCategoryId)
          : null;

        const prodCode = tmplProd.code
          ? tmplProd.code + '-' + profile.id
          : 'TPL-' + profile.id + '-' + (prodCount + 1);

        const product = await Product.create({
          name: tmplProd.name,
          description: tmplProd.description,
          code: prodCode,
          img: tmplProd.img || '',
          categoryId: catId,
          storeProfileId: profile.id,
          stock: tmplProd.stock || 0,
          price: tmplProd.price || 0,
          cost: tmplProd.cost || Math.round((tmplProd.price || 0) * 0.65 * 100) / 100,
        }, { transaction: t });

        const uomCode = tmplProd.uom || 'UNIT';
        const uomRow = await models.UnitOfMeasure.findOne({ where: { code: uomCode }, transaction: t });
        if (uomRow) {
          await ProductPresentation.create({
            productId: product.id,
            unitOfMeasureId: uomRow.id,
            unitOfMeasure: uomRow.name,
            quantity: tmplProd.stock || 0,
            brand: profile.name,
            currentPrice: tmplProd.price || 0,
            img: tmplProd.img || '',
          }, { transaction: t });

          await ProductUnitOfMeasure.create({
            productId: product.id,
            unitOfMeasureId: uomRow.id,
          }, { transaction: t });
        }
        prodCount++;
      }

      await t.commit();

      const result = await StoreProfile.findByPk(profile.id, {
        include: [
          { model: Category, as: 'categories' },
          { model: Product, as: 'products' },
        ],
      });
      res.status(201).json(result);
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (err) {
    next(err);
  }
};
