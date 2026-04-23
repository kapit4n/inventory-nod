/* eslint-disable no-console */
'use strict';

/**
 * Copies the downloaded demo images from ng-vendei-full into inventory-nod static uploads,
 * then updates Products.img to `/uploads/products/<file>`.
 *
 * Run from inventory-nod:
 *   node scripts/apply-downloaded-images.js
 */

const fs = require('fs');
const path = require('path');

const db = require('../models');
const { Product, Sequelize } = db;

function listJpgs(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|gif|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b));
}

async function main() {
  const inventoryRoot = path.join(__dirname, '..');

  const ngVendeiRoot =
    process.env.NG_VENDEI_ROOT ||
    path.join(inventoryRoot, '..', 'ng-vendei-full');

  const srcDir = path.join(ngVendeiRoot, 'src', 'assets', 'vendei', 'demo-products');
  const destDir = path.join(inventoryRoot, 'public', 'uploads', 'products');

  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source images not found: ${srcDir}`);
  }

  fs.mkdirSync(destDir, { recursive: true });

  const files = listJpgs(srcDir);
  if (!files.length) {
    throw new Error(`No images found in ${srcDir}`);
  }

  // Copy (overwrite to keep latest).
  for (const f of files) {
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
  }
  console.log(`Copied ${files.length} images to ${destDir}`);

  // Update DB: prefer seeded products; if none exist, update all products.
  const seeded = await Product.findAll({
    where: { code: { [Sequelize.Op.like]: 'SEED-PRD-%' } },
    order: [['id', 'ASC']],
  });

  const targets = seeded.length
    ? seeded
    : await Product.findAll({ order: [['id', 'ASC']] });

  let i = 0;
  for (const p of targets) {
    const file = files[i % files.length];
    const url = `/uploads/products/${file}`;
    await p.update({ img: url });
    i += 1;
  }

  console.log(`Updated ${targets.length} products to use local /uploads images.`);
  await db.sequelize.close();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

