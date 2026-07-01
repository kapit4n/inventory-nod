'use strict';

const express = require('express');
const router = express.Router();
const catalog = require('../data/api-endpoints');
const models = require('../models');

const TYPE_LABELS = {
  STRING: 'VARCHAR',
  INTEGER: 'INTEGER',
  FLOAT: 'FLOAT',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATETIME',
  TEXT: 'TEXT',
  BIGINT: 'BIGINT',
};

function describeType(seqType) {
  if (!seqType) return '—';
  const key = seqType.key || '';
  const options = seqType.options || {};
  let label = TYPE_LABELS[key] || key;
  if (options.values) {
    label += `(${options.values.map((v) => `'${v}'`).join(',')})`;
  }
  return label;
}

function describeModels() {
  const result = [];
  const seen = new Set();

  Object.keys(models).forEach((name) => {
    const model = models[name];
    if (!model || !model.rawAttributes || seen.has(name)) return;
    seen.add(name);

    const attributes = Object.entries(model.rawAttributes).map(([colName, def]) => ({
      name: colName,
      type: describeType(def.type),
      allowNull: def.allowNull !== false,
      primaryKey: def.primaryKey === true,
      autoIncrement: def.autoIncrement === true,
      defaultValue: def.defaultValue !== undefined ? String(def.defaultValue) : null,
    }));

    const associations = [];
    if (model.associations) {
      Object.values(model.associations).forEach((assoc) => {
        const targetName = assoc.target?.name || '?';
        const through = assoc.through?.name || null;
        associations.push({
          type: assoc.associationType || 'unknown',
          targetModel: targetName,
          foreignKey: assoc.foreignKey || null,
          as: assoc.as || null,
          through: through,
        });
      });
    }

    result.push({
      modelName: name,
      tableName: model.tableName || name,
      attributes,
      associations,
    });
  });

  return result;
}

router.get('/endpoints', function (req, res) {
  const proto = req.get('x-forwarded-proto') || req.protocol || 'http';
  const host = req.get('host') || 'localhost:3000';
  res.json({
    title: 'Inventory API',
    generatedAt: new Date().toISOString(),
    serverUrl: `${proto}://${host}`,
    groups: catalog.groups,
  });
});

router.get('/models', function (req, res) {
  res.json({
    generatedAt: new Date().toISOString(),
    models: describeModels(),
  });
});

module.exports = router;
