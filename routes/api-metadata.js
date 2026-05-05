'use strict';

const express = require('express');
const router = express.Router();
const catalog = require('../data/api-endpoints');

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

module.exports = router;
