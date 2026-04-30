'use strict';

const now = () => new Date();

async function clearSeedData(queryInterface, Sequelize) {
  const { Op } = Sequelize;
  await queryInterface.sequelize.query(
    `DELETE FROM ProductPresentations WHERE productId IN (SELECT id FROM Products WHERE code LIKE 'SEED-PRD-%')`
  );
  await queryInterface.bulkDelete('Products', { code: { [Op.like]: 'SEED-PRD-%' } }, {});
  await queryInterface.bulkDelete('Clients', { code: { [Op.like]: 'SEED-CLI-%' } }, {});
  await queryInterface.bulkDelete('Vendors', { code: { [Op.like]: 'SEED-VEN-%' } }, {});
  await queryInterface.bulkDelete('Categories', { code: { [Op.like]: 'SEED-CAT-%' } }, {});
}

/** 5 categories, 5 vendors, 5 clients (customers), 20 products, 20 product presentations (inventory qty). */
module.exports = {
  async up(queryInterface, Sequelize) {
    await clearSeedData(queryInterface, Sequelize);

    const db = require('../models');
    const { Category, Vendor, Client, Product, ProductPresentation, UnitOfMeasure, ProductUnitOfMeasure } = db;

    const categoryRows = [
      { name: 'Electronics', code: 'SEED-CAT-01', description: 'Devices and accessories', img: 'electronics.jpg' },
      { name: 'Grocery', code: 'SEED-CAT-02', description: 'Food and beverages', img: 'grocery.jpg' },
      { name: 'Apparel', code: 'SEED-CAT-03', description: 'Clothing', img: 'apparel.jpg' },
      { name: 'Home', code: 'SEED-CAT-04', description: 'Home and kitchen', img: 'home.jpg' },
      { name: 'Sports', code: 'SEED-CAT-05', description: 'Sports and outdoors', img: 'sports.jpg' },
    ].map((c) => ({ ...c, createdAt: now(), updatedAt: now() }));

    const vendorRows = [
      { name: 'Acme Supply Co.', code: 'SEED-VEN-01', contact: 'orders@acme.example', address: '100 Supply Ln' },
      { name: 'Global Traders LLC', code: 'SEED-VEN-02', contact: 'sales@global.example', address: '200 Trade Blvd' },
      { name: 'Metro Wholesale', code: 'SEED-VEN-03', contact: 'wholesale@metro.example', address: '300 Market St' },
      { name: 'Pacific Imports', code: 'SEED-VEN-04', contact: 'imports@pacific.example', address: '400 Harbor Rd' },
      { name: 'Summit Distributors', code: 'SEED-VEN-05', contact: 'dist@summit.example', address: '500 Peak Ave' },
    ].map((v) => ({ ...v, createdAt: now(), updatedAt: now() }));

    const clientRows = [
      { name: 'Alice Johnson', code: 'SEED-CLI-01', address: '1 Oak St' },
      { name: 'Bob Smith', code: 'SEED-CLI-02', address: '2 Maple Ave' },
      { name: 'Carol Davis', code: 'SEED-CLI-03', address: '3 Pine Rd' },
      { name: 'Dan Wilson', code: 'SEED-CLI-04', address: '4 Cedar Ln' },
      { name: 'Eve Martinez', code: 'SEED-CLI-05', address: '5 Birch Way' },
    ].map((c) => ({ ...c, createdAt: now(), updatedAt: now() }));

    const categories = await Category.bulkCreate(categoryRows, { returning: true });
    const vendors = await Vendor.bulkCreate(vendorRows, { returning: true });
    await Client.bulkCreate(clientRows);

    const catIds = categories.map((c) => c.id);
    const venIds = vendors.map((v) => v.id);

    // Images are served statically from inventory-nod/public/uploads/products/*
    // Keep this list in sync with ng-vendei-full/src/assets/vendei/demo-products/*
    const demoImageFiles = [
      'apple.jpg',
      'bananas.jpg',
      'bread.jpg',
      'milk.jpg',
      'eggs.jpg',
      'pasta.jpg',
      'rice.jpg',
      'coffee.jpg',
      'tea.jpg',
      'olive-oil.jpg',
      'cheese.jpg',
      'chicken.jpg',
      'cereal.jpg',
      'yogurt.jpg',
      'orange-juice.jpg',
      'tomato.jpg',
      'onion.jpg',
      'potato.jpg',
      'water.jpg',
      'toothpaste.jpg',
    ];

    const demoProducts = [
      { name: 'Red Apple (1 lb)', description: 'Fresh produce', categoryCode: 'SEED-CAT-02' },
      { name: 'Bananas (1 lb)', description: 'Fresh produce', categoryCode: 'SEED-CAT-02' },
      { name: 'Baguette Bread', description: 'Bakery', categoryCode: 'SEED-CAT-02' },
      { name: 'Milk (1 L)', description: 'Dairy', categoryCode: 'SEED-CAT-02' },
      { name: 'Eggs (12 pack)', description: 'Dairy & eggs', categoryCode: 'SEED-CAT-02' },
      { name: 'Pasta (500 g)', description: 'Pantry staple', categoryCode: 'SEED-CAT-02' },
      { name: 'White Rice (1 kg)', description: 'Pantry staple', categoryCode: 'SEED-CAT-02' },
      { name: 'Coffee (ground, 250 g)', description: 'Beverage', categoryCode: 'SEED-CAT-02' },
      { name: 'Black Tea (20 bags)', description: 'Beverage', categoryCode: 'SEED-CAT-02' },
      { name: 'Olive Oil (500 ml)', description: 'Cooking', categoryCode: 'SEED-CAT-02' },
      { name: 'Cheddar Cheese (200 g)', description: 'Dairy', categoryCode: 'SEED-CAT-02' },
      { name: 'Chicken Breast (1 lb)', description: 'Meat', categoryCode: 'SEED-CAT-02' },
      { name: 'Laundry Detergent (1.5 L)', description: 'Cleaning', categoryCode: 'SEED-CAT-04' },
      { name: 'Paper Towels (2 rolls)', description: 'Household', categoryCode: 'SEED-CAT-04' },
      { name: 'Hand Soap (500 ml)', description: 'Household', categoryCode: 'SEED-CAT-04' },
      { name: 'Toothpaste (120 g)', description: 'Personal care', categoryCode: 'SEED-CAT-04' },
      { name: 'Shampoo (400 ml)', description: 'Personal care', categoryCode: 'SEED-CAT-04' },
      { name: 'Smartphone (Demo)', description: 'Device', categoryCode: 'SEED-CAT-01' },
      { name: 'Wireless Headphones (Demo)', description: 'Accessory', categoryCode: 'SEED-CAT-01' },
      { name: 'Bottled Water (1.5 L)', description: 'Beverage', categoryCode: 'SEED-CAT-02' },
    ];

    const categoryIdByCode = new Map(categories.map((c) => [c.code, c.id]));

    const uomRows = await UnitOfMeasure.findAll({ order: [['code', 'ASC']] });
    const uomIdByCode = new Map(uomRows.map((u) => [u.code, u.id]));

    async function linkProductUnits(productId, codes) {
      const rows = codes
        .map((code) => {
          const unitOfMeasureId = uomIdByCode.get(code);
          if (!unitOfMeasureId) {
            return null;
          }
          return {
            productId,
            unitOfMeasureId,
            createdAt: now(),
            updatedAt: now(),
          };
        })
        .filter(Boolean);
      if (rows.length) {
        await ProductUnitOfMeasure.bulkCreate(rows);
      }
    }

    const products = [];
    for (let i = 0; i < demoProducts.length; i += 1) {
      const n = String(i + 1).padStart(2, '0');
      const vendorId = venIds[i % venIds.length];
      const def = demoProducts[i];
      const categoryId = categoryIdByCode.get(def.categoryCode) ?? catIds[i % catIds.length];
      const file = demoImageFiles[i % demoImageFiles.length];
      const created = await Product.create({
        name: def.name,
        description: def.description,
        code: `SEED-PRD-${n}`,
        img: `/uploads/products/${file}`,
        categoryId,
        vendorId,
      });
      products.push(created);

      if (def.categoryCode === 'SEED-CAT-01') {
        await linkProductUnits(created.id, ['UNIT', 'BOX', 'PACK']);
      } else if (def.categoryCode === 'SEED-CAT-04') {
        await linkProductUnits(created.id, ['UNIT', 'BOX', 'PACK', 'L', 'ML']);
      } else {
        await linkProductUnits(created.id, ['UNIT', 'BOX', 'PACK', 'KG', 'G', 'L', 'ML']);
      }
    }

    const presentationUnitCodes = ['UNIT', 'BOX', 'KG', 'PACK'];
    const brands = ['House', 'Value', 'Prime', 'Select'];

    for (let i = 0; i < products.length; i += 1) {
      const p = products[i];
      const qty = 10 + i * 4;
      const code = presentationUnitCodes[i % presentationUnitCodes.length];
      const uomId = uomIdByCode.get(code);
      const uomRow = uomRows.find((u) => u.code === code);
      await ProductPresentation.create({
        productId: p.id,
        unitOfMeasureId: uomId || null,
        unitOfMeasure: uomRow ? uomRow.name : code,
        quantity: qty,
        brand: brands[i % brands.length],
        currentPrice: 9.99 + i * 1.5,
      });

      // Keep legacy inventory fields in sync for the Angular inventory pages.
      await p.update({
        stock: qty,
        price: 9.99 + i * 1.5,
        cost: Math.max(0, 9.99 + i * 1.5 - 2.5),
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await clearSeedData(queryInterface, Sequelize);
  },
};
