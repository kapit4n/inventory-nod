'use strict';

/**
 * Extra catalog units for demos (grocery / retail). Safe to re-run: uses findOrCreate by code.
 * Base units from migration: UNIT, BOX, PACK, KG, G, L, ML.
 */
module.exports = {
  async up() {
    const db = require('../models');
    const { UnitOfMeasure } = db;

    const extras = [
      { code: 'DOZ', name: 'Dozen (12)' },
      { code: 'PAIR', name: 'Pair' },
      { code: 'BOTTLE', name: 'Bottle' },
      { code: 'CAN', name: 'Can' },
      { code: 'CASE', name: 'Case' },
      { code: 'ROLL', name: 'Roll' },
      { code: 'SLEEVE', name: 'Sleeve' },
      { code: 'TRAY', name: 'Tray' },
      { code: 'BUNCH', name: 'Bunch' },
      { code: 'SLICE', name: 'Slice' },
    ];

    for (const row of extras) {
      await UnitOfMeasure.findOrCreate({
        where: { code: row.code },
        defaults: { name: row.name },
      });
    }
  },

  async down() {
    const db = require('../models');
    const { UnitOfMeasure, Sequelize } = db;
    await UnitOfMeasure.destroy({
      where: {
        code: {
          [Sequelize.Op.in]: [
            'DOZ',
            'PAIR',
            'BOTTLE',
            'CAN',
            'CASE',
            'ROLL',
            'SLEEVE',
            'TRAY',
            'BUNCH',
            'SLICE',
          ],
        },
      },
    });
  },
};
