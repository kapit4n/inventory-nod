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
    const { Category, Vendor, Client, Product, ProductPresentation } = db;

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

    const products = [];
    for (let i = 1; i <= 20; i += 1) {
      const n = String(i).padStart(2, '0');
      const categoryId = catIds[(i - 1) % catIds.length];
      const vendorId = venIds[(i - 1) % venIds.length];
      products.push(
        await Product.create({
          name: `Demo Product ${n}`,
          description: `Seeded product ${n} for inventory demo`,
          code: `SEED-PRD-${n}`,
          img: `product-${n}.jpg`,
          categoryId,
          vendorId,
        })
      );
    }

    const units = ['units', 'box', 'kg', 'pack'];
    const brands = ['House', 'Value', 'Prime', 'Select'];

    for (let i = 0; i < products.length; i += 1) {
      const p = products[i];
      const qty = 10 + i * 4;
      await ProductPresentation.create({
        productId: p.id,
        unitOfMeasure: units[i % units.length],
        quantity: qty,
        brand: brands[i % brands.length],
        currentPrice: 9.99 + i * 1.5,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await clearSeedData(queryInterface, Sequelize);
  },
};
