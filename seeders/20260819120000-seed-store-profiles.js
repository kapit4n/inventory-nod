'use strict';

const now = () => new Date();

async function clearSeedData(queryInterface, Sequelize) {
  const { Op } = Sequelize;
  await queryInterface.sequelize.query(
    `DELETE FROM ProductPresentations WHERE productId IN (SELECT id FROM Products WHERE code LIKE 'SEED-PRD-%')`
  );
  await queryInterface.bulkDelete('Products', { code: { [Op.like]: 'SEED-PRD-%' } }, {});
  await queryInterface.bulkDelete('Categories', { code: { [Op.like]: 'SEED-CAT-%' } }, {});
  await queryInterface.bulkDelete('StoreProfiles', { slug: { [Op.in]: ['supermarket', 'chicken-store', 'hardware', 'auto-parts', 'bakery'] } }, {});
}

function uomId(uomRows, code) {
  const row = uomRows.find((u) => u.code === code);
  return row ? row.id : null;
}

function uomName(uomRows, code) {
  const row = uomRows.find((u) => u.code === code);
  return row ? row.name : code;
}

async function linkProductUnits(productId, codes, uomRows, ProductUnitOfMeasure) {
  const rows = codes
    .map((code) => {
      const id = uomId(uomRows, code);
      if (!id) return null;
      return { productId, unitOfMeasureId: id, createdAt: now(), updatedAt: now() };
    })
    .filter(Boolean);
  if (rows.length) {
    await ProductUnitOfMeasure.bulkCreate(rows);
  }
}

// ─── Profile definitions ────────────────────────────────────────────────

const profiles = [
  {
    name: 'Supermarket', slug: 'supermarket', description: 'Groceries, beverages and household products',
    businessType: 'supermarket', businessName: 'Mi Supermarket',
    currency: 'BOB', currencySymbol: 'Bs', locale: 'es-BO',
    taxId: '12345678', taxLabel: 'NIT',
    address: 'Av. Principal 123, Cochabamba',
    capabilities: ['BARCODE', 'WEIGHT_PRODUCTS', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION', 'LOYALTY'],
    receiptConfig: { paperWidth: 80, headerLines: ['Mi Supermarket - Tu tienda de confianza'], footerLines: ['Gracias por su compra'] },
    posConfig: { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' },
  },
  {
    name: 'Chicken Store', slug: 'chicken-store', description: 'Chicken products, combos and sides',
    businessType: 'chicken-store', businessName: 'Pollos Don Pedro',
    currency: 'BOB', currencySymbol: 'Bs', locale: 'es-BO',
    taxId: '87654321', taxLabel: 'NIT',
    address: 'Calle Mercado 456, Cochabamba',
    capabilities: ['BARCODE', 'COMBOS', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION'],
    receiptConfig: { paperWidth: 80, headerLines: ['Pollos Don Pedro - El mejor sabor'], footerLines: ['Vengan pronto!'] },
    posConfig: { catalogColumns: 3, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' },
  },
  {
    name: 'Hardware Store', slug: 'hardware', description: 'Tools, building materials and electrical supplies',
    businessType: 'hardware', businessName: 'Ferreteria Industrial',
    currency: 'BOB', currencySymbol: 'Bs', locale: 'es-BO',
    taxId: '11223344', taxLabel: 'NIT',
    address: 'Zona Industrial 789, Cochabamba',
    capabilities: ['BARCODE', 'VARIABLE_QUANTITY', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION'],
    receiptConfig: { paperWidth: 80, headerLines: ['Ferreteria Industrial - Todo para tu proyecto'], footerLines: ['Garantia en todos nuestros productos'] },
    posConfig: { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' },
  },
  {
    name: 'Auto Parts', slug: 'auto-parts', description: 'Automotive parts, fluids and accessories',
    businessType: 'auto-parts', businessName: 'AutoPartes Express',
    currency: 'BOB', currencySymbol: 'Bs', locale: 'es-BO',
    taxId: '44332211', taxLabel: 'NIT',
    address: 'Av. Vehicles 321, Cochabamba',
    capabilities: ['BARCODE', 'SERIAL_NUMBERS', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION'],
    receiptConfig: { paperWidth: 80, headerLines: ['AutoPartes Express - Repuestos originales'], footerLines: ['Consulte por garantia'] },
    posConfig: { catalogColumns: 4, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' },
  },
  {
    name: 'Bakery', slug: 'bakery', description: 'Breads, pastries, cakes and desserts',
    businessType: 'bakery', businessName: 'Panaderia La Delicia',
    currency: 'BOB', currencySymbol: 'Bs', locale: 'es-BO',
    taxId: '55667788', taxLabel: 'NIT',
    address: 'Calle Dulce 654, Cochabamba',
    capabilities: ['WEIGHT_PRODUCTS', 'COMBOS', 'DISCOUNTS', 'CUSTOMERS', 'TAX_CALCULATION', 'LOYALTY'],
    receiptConfig: { paperWidth: 57, headerLines: ['Panaderia La Delicia - Momentos dulces'], footerLines: ['Hecho con amor'] },
    posConfig: { catalogColumns: 3, showProductImages: true, quickProducts: [], defaultSellingMode: 'UNIT' },
  },
];

// ─── Categories per profile ─────────────────────────────────────────────

const categoryData = {
  supermarket: [
    { name: 'Beverages', code: 'SEED-CAT-SM-01', description: 'Drinks and juices' },
    { name: 'Dairy', code: 'SEED-CAT-SM-02', description: 'Milk, cheese and yogurt' },
    { name: 'Snacks', code: 'SEED-CAT-SM-03', description: 'Chips, cookies and treats' },
    { name: 'Groceries', code: 'SEED-CAT-SM-04', description: 'Rice, pasta, oil and staples' },
    { name: 'Cleaning', code: 'SEED-CAT-SM-05', description: 'Detergents and cleaning supplies' },
  ],
  'chicken-store': [
    { name: 'Whole Chicken', code: 'SEED-CAT-CH-01', description: 'Whole and grilled chicken' },
    { name: 'Chicken Cuts', code: 'SEED-CAT-CH-02', description: 'Breast, wings, thighs and fillets' },
    { name: 'Combos', code: 'SEED-CAT-CH-03', description: 'Meal combos with sides' },
    { name: 'Sides', code: 'SEED-CAT-CH-04', description: 'French fries, coleslaw and more' },
    { name: 'Sauces', code: 'SEED-CAT-CH-05', description: 'Spicy, BBQ and other sauces' },
  ],
  hardware: [
    { name: 'Tools', code: 'SEED-CAT-HW-01', description: 'Hand tools and power tools' },
    { name: 'Fasteners', code: 'SEED-CAT-HW-02', description: 'Screws, nails and bolts' },
    { name: 'Building', code: 'SEED-CAT-HW-03', description: 'Cement, bricks and pipes' },
    { name: 'Electrical', code: 'SEED-CAT-HW-04', description: 'Cables, bulbs and switches' },
    { name: 'Paint', code: 'SEED-CAT-HW-05', description: 'Paints, brushes and supplies' },
  ],
  'auto-parts': [
    { name: 'Engine', code: 'SEED-CAT-AP-01', description: 'Oil, filters and engine parts' },
    { name: 'Brakes', code: 'SEED-CAT-AP-02', description: 'Brake pads, discs and fluid' },
    { name: 'Electrical', code: 'SEED-CAT-AP-03', description: 'Batteries, bulbs and spark plugs' },
    { name: 'Fluids', code: 'SEED-CAT-AP-04', description: 'Coolant, brake fluid and washer' },
    { name: 'Accessories', code: 'SEED-CAT-AP-05', description: 'Wiper blades and misc' },
  ],
  bakery: [
    { name: 'Breads', code: 'SEED-CAT-BK-01', description: 'French bread, white bread and more' },
    { name: 'Pastries', code: 'SEED-CAT-BK-02', description: 'Croissants, cheese pastries and pies' },
    { name: 'Cakes', code: 'SEED-CAT-BK-03', description: 'Chocolate, vanilla and fruit cakes' },
    { name: 'Cookies', code: 'SEED-CAT-BK-04', description: 'Cookies, muffins and donuts' },
    { name: 'Beverages', code: 'SEED-CAT-BK-05', description: 'Coffee, tea and hot chocolate' },
  ],
};

// ─── Products per profile (15 each) ────────────────────────────────────

// ─── Helper: generate image asset path from profile slug and product name ──

function productImgPath(profileSlug, productName) {
  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `assets/vendei/catalog/${profileSlug}/${slug}.svg`;
}

const productData = {
  supermarket: [
    { name: 'Coca Cola 2L', description: 'Gaseosa cola', catCode: 'SEED-CAT-SM-01', price: 12, uom: 'UNIT', stock: 100 },
    { name: 'Pepsi 2L', description: 'Gaseosa cola', catCode: 'SEED-CAT-SM-01', price: 11, uom: 'UNIT', stock: 80 },
    { name: 'Milk 1L', description: 'Leche entera', catCode: 'SEED-CAT-SM-02', price: 7, uom: 'L', stock: 60 },
    { name: 'Cheddar Cheese 200g', description: 'Queso cheddar', catCode: 'SEED-CAT-SM-02', price: 14, uom: 'G', stock: 30 },
    { name: 'Yogurt 500ml', description: 'Yogurt natural', catCode: 'SEED-CAT-SM-02', price: 8, uom: 'ML', stock: 40 },
    { name: 'Potato Chips 150g', description: 'Papas fritas', catCode: 'SEED-CAT-SM-03', price: 9, uom: 'UNIT', stock: 50 },
    { name: 'Chocolate Cookies 200g', description: 'Galletas de chocolate', catCode: 'SEED-CAT-SM-03', price: 8, uom: 'UNIT', stock: 45 },
    { name: 'Rice 1kg', description: 'Arroz blanco', catCode: 'SEED-CAT-SM-04', price: 8, uom: 'KG', stock: 70 },
    { name: 'Sugar 1kg', description: 'Azucar refinada', catCode: 'SEED-CAT-SM-04', price: 7, uom: 'KG', stock: 65 },
    { name: 'Cooking Oil 1L', description: 'Aceite vegetal', catCode: 'SEED-CAT-SM-04', price: 12, uom: 'L', stock: 55 },
    { name: 'Spaghetti 500g', description: 'Fideos espagueti', catCode: 'SEED-CAT-SM-04', price: 5, uom: 'G', stock: 40 },
    { name: 'Bread Loaf', description: 'Pan de molde', catCode: 'SEED-CAT-SM-04', price: 6, uom: 'UNIT', stock: 30 },
    { name: 'Laundry Detergent 1L', description: 'Detergente líquido', catCode: 'SEED-CAT-SM-05', price: 18, uom: 'L', stock: 35 },
    { name: 'Toilet Paper 4-pack', description: 'Papel higiénico', catCode: 'SEED-CAT-SM-05', price: 14, uom: 'PACK', stock: 50 },
    { name: 'Dish Soap 500ml', description: 'Jabón para platos', catCode: 'SEED-CAT-SM-05', price: 6, uom: 'ML', stock: 40 },
  ],
  'chicken-store': [
    { name: 'Whole Chicken', description: 'Pollo entero', catCode: 'SEED-CAT-CH-01', price: 35, uom: 'KG', stock: 25 },
    { name: 'Grilled Chicken', description: 'Pollo a la brasa', catCode: 'SEED-CAT-CH-01', price: 40, uom: 'UNIT', stock: 15 },
    { name: 'Chicken Breast', description: 'Pechuga de pollo', catCode: 'SEED-CAT-CH-02', price: 32, uom: 'KG', stock: 20 },
    { name: 'Chicken Wings', description: 'Alitas de pollo', catCode: 'SEED-CAT-CH-02', price: 25, uom: 'KG', stock: 18 },
    { name: 'Chicken Thigh', description: 'Muslo de pollo', catCode: 'SEED-CAT-CH-02', price: 22, uom: 'KG', stock: 20 },
    { name: 'Chicken Fillet', description: 'Filete de pollo', catCode: 'SEED-CAT-CH-02', price: 36, uom: 'KG', stock: 15 },
    { name: 'Chicken Combo', description: 'Combo: pollo + papas + ensalada', catCode: 'SEED-CAT-CH-03', price: 55, uom: 'UNIT', stock: 20 },
    { name: 'Family Chicken Combo', description: 'Combo familiar: 2 pollos + papas + ensalada', catCode: 'SEED-CAT-CH-03', price: 95, uom: 'UNIT', stock: 10 },
    { name: 'Kids Combo', description: 'Combo infantil: alitas + papas + jugo', catCode: 'SEED-CAT-CH-03', price: 35, uom: 'UNIT', stock: 15 },
    { name: 'French Fries', description: 'Papas fritas', catCode: 'SEED-CAT-CH-04', price: 12, uom: 'UNIT', stock: 30 },
    { name: 'Coleslaw', description: 'Ensalada coleslaw', catCode: 'SEED-CAT-CH-04', price: 8, uom: 'UNIT', stock: 20 },
    { name: 'Mashed Potatoes', description: 'Puré de papas', catCode: 'SEED-CAT-CH-04', price: 10, uom: 'UNIT', stock: 15 },
    { name: 'Spicy Sauce', description: 'Salsa picante', catCode: 'SEED-CAT-CH-05', price: 5, uom: 'UNIT', stock: 40 },
    { name: 'BBQ Sauce', description: 'Salsa barbacoa', catCode: 'SEED-CAT-CH-05', price: 5, uom: 'UNIT', stock: 35 },
    { name: 'Garlic Sauce', description: 'Salsa de ajo', catCode: 'SEED-CAT-CH-05', price: 5, uom: 'UNIT', stock: 30 },
  ],
  hardware: [
    { name: 'Hammer', description: 'Martillo de uña', catCode: 'SEED-CAT-HW-01', price: 65, uom: 'UNIT', stock: 20 },
    { name: 'Screwdriver Set', description: 'Juego de destornilladores', catCode: 'SEED-CAT-HW-01', price: 45, uom: 'PACK', stock: 15 },
    { name: 'Pliers', description: 'Alicates universales', catCode: 'SEED-CAT-HW-01', price: 38, uom: 'UNIT', stock: 18 },
    { name: 'Tape Measure 5m', description: 'Cinta métrica 5 metros', catCode: 'SEED-CAT-HW-01', price: 25, uom: 'UNIT', stock: 25 },
    { name: 'Screws Assorted 100pc', description: 'Tornillos surtidos', catCode: 'SEED-CAT-HW-02', price: 18, uom: 'PACK', stock: 40 },
    { name: 'Nails 1kg', description: 'Clavos various', catCode: 'SEED-CAT-HW-02', price: 15, uom: 'KG', stock: 35 },
    { name: 'Bolts M8 50pc', description: 'Tornillos hexagonales M8', catCode: 'SEED-CAT-HW-02', price: 22, uom: 'PACK', stock: 30 },
    { name: 'Cement 50kg', description: 'Semento Portland', catCode: 'SEED-CAT-HW-03', price: 48, uom: 'KG', stock: 50 },
    { name: 'Brick (standard)', description: 'Ladrillo estándar', catCode: 'SEED-CAT-HW-03', price: 3, uom: 'UNIT', stock: 200 },
    { name: 'PVC Pipe 1m', description: 'Tubo PVC 1 metro', catCode: 'SEED-CAT-HW-03', price: 12, uom: 'UNIT', stock: 40 },
    { name: 'Electrical Cable 10m', description: 'Cable eléctrico 10 metros', catCode: 'SEED-CAT-HW-04', price: 35, uom: 'UNIT', stock: 30 },
    { name: 'Light Bulb LED 9W', description: 'Bombillo LED 9W', catCode: 'SEED-CAT-HW-04', price: 15, uom: 'UNIT', stock: 50 },
    { name: 'Paint White 1L', description: 'Pintura blanca 1 litro', catCode: 'SEED-CAT-HW-05', price: 45, uom: 'L', stock: 25 },
    { name: 'Paint Roller Set', description: 'Juego de rodillos', catCode: 'SEED-CAT-HW-05', price: 28, uom: 'PACK', stock: 20 },
    { name: 'Sandpaper 10-pack', description: 'Lija various', catCode: 'SEED-CAT-HW-05', price: 12, uom: 'PACK', stock: 35 },
  ],
  'auto-parts': [
    { name: 'Engine Oil 5W30 4L', description: 'Aceite de motor 5W30', catCode: 'SEED-CAT-AP-01', price: 85, uom: 'L', stock: 30 },
    { name: 'Oil Filter', description: 'Filtro de aceite', catCode: 'SEED-CAT-AP-01', price: 28, uom: 'UNIT', stock: 25 },
    { name: 'Air Filter', description: 'Filtro de aire', catCode: 'SEED-CAT-AP-01', price: 45, uom: 'UNIT', stock: 20 },
    { name: 'Spark Plug Set 4pc', description: 'Juego de bujías', catCode: 'SEED-CAT-AP-01', price: 60, uom: 'PACK', stock: 20 },
    { name: 'Brake Pads Front', description: 'Balatas delanteras', catCode: 'SEED-CAT-AP-02', price: 120, uom: 'PACK', stock: 15 },
    { name: 'Brake Pads Rear', description: 'Balatas traseras', catCode: 'SEED-CAT-AP-02', price: 95, uom: 'PACK', stock: 15 },
    { name: 'Brake Disc Front', description: 'Disco de freno delantero', catCode: 'SEED-CAT-AP-02', price: 180, uom: 'UNIT', stock: 10 },
    { name: 'Car Battery 12V 60Ah', description: 'Batería 12V 60Ah', catCode: 'SEED-CAT-AP-03', price: 350, uom: 'UNIT', stock: 8 },
    { name: 'Headlight Bulb H4', description: 'Bombillo faro H4', catCode: 'SEED-CAT-AP-03', price: 35, uom: 'UNIT', stock: 25 },
    { name: 'Tail Light Bulb', description: 'Bombillo trasero', catCode: 'SEED-CAT-AP-03', price: 18, uom: 'UNIT', stock: 30 },
    { name: 'Coolant 1L', description: 'Refrigerante para motor', catCode: 'SEED-CAT-AP-04', price: 32, uom: 'L', stock: 20 },
    { name: 'Brake Fluid 500ml', description: 'Líquido de frenos', catCode: 'SEED-CAT-AP-04', price: 25, uom: 'ML', stock: 25 },
    { name: 'Washer Fluid 1L', description: 'Líquido limpiaparabrisas', catCode: 'SEED-CAT-AP-04', price: 15, uom: 'L', stock: 30 },
    { name: 'Wiper Blades Pair', description: 'Limpiaparabrisas par', catCode: 'SEED-CAT-AP-05', price: 55, uom: 'PACK', stock: 20 },
    { name: 'Seat Cover Set', description: 'Juego de fundas para asientos', catCode: 'SEED-CAT-AP-05', price: 150, uom: 'PACK', stock: 8 },
  ],
  bakery: [
    { name: 'French Bread', description: 'Pan francés', catCode: 'SEED-CAT-BK-01', price: 3, uom: 'UNIT', stock: 50 },
    { name: 'White Bread Loaf', description: 'Pan de molde blanco', catCode: 'SEED-CAT-BK-01', price: 8, uom: 'UNIT', stock: 30 },
    { name: 'Whole Wheat Bread', description: 'Pan integral', catCode: 'SEED-CAT-BK-01', price: 10, uom: 'UNIT', stock: 20 },
    { name: 'Croissant', description: 'Croissant de mantequilla', catCode: 'SEED-CAT-BK-02', price: 5, uom: 'UNIT', stock: 25 },
    { name: 'Cheese Pastry', description: 'Pastelito de queso', catCode: 'SEED-CAT-BK-02', price: 6, uom: 'UNIT', stock: 20 },
    { name: 'Apple Pie Slice', description: 'Rebanada de tarta de manzana', catCode: 'SEED-CAT-BK-02', price: 12, uom: 'UNIT', stock: 15 },
    { name: 'Ham & Cheese Pastry', description: 'Pastelito de jamón y queso', catCode: 'SEED-CAT-BK-02', price: 7, uom: 'UNIT', stock: 20 },
    { name: 'Chocolate Cake', description: 'Torta de chocolate', catCode: 'SEED-CAT-BK-03', price: 15, uom: 'UNIT', stock: 10 },
    { name: 'Vanilla Cake', description: 'Torta de vainilla', catCode: 'SEED-CAT-BK-03', price: 14, uom: 'UNIT', stock: 10 },
    { name: 'Tres Leches Cake', description: 'Torta tres leches', catCode: 'SEED-CAT-BK-03', price: 18, uom: 'UNIT', stock: 8 },
    { name: 'Cookies Assorted 6pc', description: 'Galletas surtidas', catCode: 'SEED-CAT-BK-04', price: 10, uom: 'PACK', stock: 25 },
    { name: 'Muffin Blueberry', description: 'Muffin de arándanos', catCode: 'SEED-CAT-BK-04', price: 8, uom: 'UNIT', stock: 18 },
    { name: 'Donut Glazed', description: 'Rosquilla glaseada', catCode: 'SEED-CAT-BK-04', price: 5, uom: 'UNIT', stock: 30 },
    { name: 'Coffee Regular', description: 'Café regular', catCode: 'SEED-CAT-BK-05', price: 6, uom: 'UNIT', stock: 100 },
    { name: 'Hot Chocolate', description: 'Chocolate caliente', catCode: 'SEED-CAT-BK-05', price: 7, uom: 'UNIT', stock: 80 },
  ],
};

// ─── Seeder ─────────────────────────────────────────────────────────────

module.exports = {
  async up(queryInterface, Sequelize) {
    await clearSeedData(queryInterface, Sequelize);

    const db = require('../models');
    const { StoreProfile, Category, Product, ProductPresentation, ProductUnitOfMeasure } = db;

    const uomRows = await db.UnitOfMeasure.findAll({ order: [['code', 'ASC']] });

    for (const profileDef of profiles) {
      const profile = await StoreProfile.create({
        ...profileDef,
        active: true,
        defaultProfile: profileDef.slug === 'supermarket',
        createdAt: now(),
        updatedAt: now(),
      });

      const catDefs = categoryData[profileDef.slug];
      const cats = [];
      for (const cd of catDefs) {
        const cat = await Category.create({
          ...cd,
          img: '',
          storeProfileId: profile.id,
          createdAt: now(),
          updatedAt: now(),
        });
        cats.push(cat);
      }
      const catIdByCode = new Map(cats.map((c) => [c.code, c.id]));

      const prods = productData[profileDef.slug];
      for (let i = 0; i < prods.length; i++) {
        const n = String(i + 1).padStart(2, '0');
        const prefix = profileDef.slug.substring(0, 2).toUpperCase();
        const pd = prods[i];
        const catId = catIdByCode.get(pd.catCode);

        const product = await Product.create({
          name: pd.name,
          description: pd.description,
          code: `SEED-PRD-${prefix}-${n}`,
          img: productImgPath(profileDef.slug, pd.name),
          categoryId: catId,
          storeProfileId: profile.id,
          stock: pd.stock,
          price: pd.price,
          cost: Math.round(pd.price * 0.65 * 100) / 100,
          createdAt: now(),
          updatedAt: now(),
        });

        const uomCodes = pd.uom === 'KG' ? ['UNIT', 'KG', 'G'] :
                         pd.uom === 'L' ? ['UNIT', 'L', 'ML'] :
                         pd.uom === 'ML' ? ['UNIT', 'ML'] :
                         pd.uom === 'G' ? ['UNIT', 'G'] :
                         pd.uom === 'PACK' ? ['UNIT', 'PACK', 'BOX'] :
                         ['UNIT', 'BOX', 'PACK'];
        await linkProductUnits(product.id, uomCodes, uomRows, ProductUnitOfMeasure);

        await ProductPresentation.create({
          productId: product.id,
          unitOfMeasureId: uomId(uomRows, pd.uom) || uomId(uomRows, 'UNIT'),
          unitOfMeasure: uomName(uomRows, pd.uom),
          quantity: pd.stock,
          brand: profileDef.name,
          currentPrice: pd.price,
          img: productImgPath(profileDef.slug, pd.name),
          createdAt: now(),
          updatedAt: now(),
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await clearSeedData(queryInterface, Sequelize);
  },
};
