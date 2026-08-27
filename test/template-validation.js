#!/usr/bin/env node
/**
 * Business Template Validation (Phase 7–9, MB-034–048)
 *
 * Validates seed data integrity for all 6 catalog templates.
 * Run from inventory-nod: node test/template-validation.js
 */

const path = require('path');
const models = require('../models');

const templates = [
  { slug: 'supermarket', name: 'Supermarket', expectedType: 'supermarket', minCats: 5, minProds: 15 },
  { slug: 'chicken-store', name: 'Chicken Store', expectedType: 'chicken-store', minCats: 5, minProds: 15 },
  { slug: 'butcher-shop', name: 'Butcher Shop', expectedType: 'butcher', minCats: 5, minProds: 15 },
  { slug: 'clothing-store', name: 'Clothing Store', expectedType: 'clothing', minCats: 5, minProds: 15 },
  { slug: 'bakery', name: 'Bakery', expectedType: 'bakery', minCats: 5, minProds: 15 },
  { slug: 'hardware-store', name: 'Hardware Store', expectedType: 'hardware', minCats: 5, minProds: 15 },
];

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, msg) {
  if (!condition) throw new Error(msg);
}

function assertHas(arr, val, label) {
  assert(arr.includes(val), `${label}: expected to include "${val}", got [${arr}]`);
}

async function validateTemplate(t) {
  console.log(`\n--- ${t.name} (${t.slug}) ---`);

  const tpl = await models.CatalogTemplate.findOne({
    where: { slug: t.slug },
    include: [
      { model: models.CatalogTemplateCategory, as: 'categories' },
      { model: models.CatalogTemplateProduct, as: 'products' },
    ],
  });

  assert(tpl, `Template "${t.slug}" not found in database`);

  // Basic fields
  assert(tpl.name === t.name, `name: expected "${t.name}", got "${tpl.name}"`);
  assert(tpl.businessType === t.expectedType, `businessType: expected "${t.expectedType}", got "${tpl.businessType}"`);
  assert(tpl.active === true, 'template should be active');
  console.log(`  ✓ Name: ${tpl.name}, type: ${tpl.businessType}, active: ${tpl.active}`);

  // Categories
  assert(tpl.categories.length >= t.minCats, `Expected ≥${t.minCats} categories, got ${tpl.categories.length}`);
  const codes = tpl.categories.map((c) => c.code);
  assert(new Set(codes).size === codes.length, 'Category codes must be unique');
  console.log(`  ✓ Categories: ${tpl.categories.length} (${tpl.categories.map((c) => c.name).join(', ')})`);

  // Products
  assert(tpl.products.length >= t.minProds, `Expected ≥${t.minProds} products, got ${tpl.products.length}`);
  const prodNames = tpl.products.map((p) => p.name);
  assert(new Set(prodNames).size === prodNames.length, 'Product names must be unique');
  const prices = tpl.products.map((p) => Number(p.price));
  assert(prices.every((p) => p > 0), 'All products should have positive prices');
  console.log(`  ✓ Products: ${tpl.products.length}, all prices > 0`);

  // Products linked to categories
  const catIds = new Set(tpl.categories.map((c) => c.id));
  const linked = tpl.products.filter((p) => p.catalogTemplateCategoryId && catIds.has(p.catalogTemplateCategoryId));
  assert(linked.length >= tpl.products.length * 0.8, `Expected ≥80% products linked to categories, got ${Math.round(linked.length / tpl.products.length * 100)}%`);
  console.log(`  ✓ ${linked.length}/${tpl.products.length} products linked to categories`);

  // posConfig
  const posCfg = tpl.posConfig;
  assert(posCfg, 'posConfig is missing');
  assert(posCfg.catalogColumns >= 2 && posCfg.catalogColumns <= 8, `catalogColumns should be 2–8, got ${posCfg.catalogColumns}`);
  assert(typeof posCfg.showProductImages === 'boolean', 'showProductImages should be boolean');
  assert(Array.isArray(posCfg.quickProducts), 'quickProducts should be array');
  assert(posCfg.defaultSellingMode, 'defaultSellingMode is missing');
  assert(Array.isArray(posCfg.enabledPaymentTypes), 'enabledPaymentTypes should be array');
  assert(posCfg.enabledPaymentTypes.length >= 1, 'enabledPaymentTypes should have at least 1 entry');
  console.log(`  ✓ posConfig: columns=${posCfg.catalogColumns}, images=${posCfg.showProductImages}, sellingMode=${posCfg.defaultSellingMode}, payments=[${posCfg.enabledPaymentTypes}]`);

  // receiptConfig
  const rcptCfg = tpl.receiptConfig;
  assert(rcptCfg, 'receiptConfig is missing');
  assert(rcptCfg.paperWidth >= 57 && rcptCfg.paperWidth <= 120, `paperWidth should be 57–120mm, got ${rcptCfg.paperWidth}`);
  assert(Array.isArray(rcptCfg.headerLines), 'headerLines should be array');
  assert(Array.isArray(rcptCfg.footerLines), 'footerLines should be array');
  console.log(`  ✓ receiptConfig: ${rcptCfg.paperWidth}mm, header=[${rcptCfg.headerLines}], footer=[${rcptCfg.footerLines}]`);

  // Capabilities
  const caps = tpl.capabilities;
  assert(Array.isArray(caps), 'capabilities should be array');
  assert(caps.length >= 2, `Expected ≥2 capabilities, got ${caps.length}`);
  assertHas(caps, 'DISCOUNTS', 'capabilities');
  assertHas(caps, 'CUSTOMERS', 'capabilities');
  console.log(`  ✓ Capabilities: ${caps.join(', ')}`);

  // Verify related products match category codes
  const catCodeMap = {};
  tpl.categories.forEach((c) => { catCodeMap[c.code] = c.id; });
  for (const p of tpl.products) {
    assert(p.catalogTemplateCategoryId, `Product "${p.name}" should have a category`);
    assert(catIds.has(p.catalogTemplateCategoryId), `Product "${p.name}" references non-existent category`);
  }
  console.log(`  ✓ All products reference valid categories`);

  console.log(`  ✓ PASSED`);
}

async function run() {
  try {
    await models.sequelize.authenticate();
    console.log('Database connected ✓');
  } catch (e) {
    console.error('Cannot connect to database:', e.message);
    process.exit(1);
  }

  for (const t of templates) {
    try {
      await validateTemplate(t);
      passed++;
    } catch (e) {
      failed++;
      failures.push({ template: t.slug, error: e.message });
      console.error(`  ✗ FAILED: ${e.message}`);
    }
  }

  console.log(`\n=== Template Validation (Phase 7–9) ===`);
  console.log(`Passed: ${passed}/${templates.length}`);
  console.log(`Failed: ${failed}/${templates.length}`);
  if (failures.length) {
    console.log('\nFailures:');
    failures.forEach((f) => console.log(`  - ${f.template}: ${f.error}`));
    process.exit(1);
  } else {
    console.log('\nAll templates validated! ✓');
    process.exit(0);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
