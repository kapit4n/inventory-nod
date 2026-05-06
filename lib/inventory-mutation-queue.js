'use strict';

/**
 * Serialize all SQLite mutations that touch products / lots / stock.
 * The Angular POS fires reduceInventory + updateTotalSelled + updateQuantitySelled
 * in parallel per line (and multiple lines), which overwhelms SQLite even with pool.max=1.
 */
let chain = Promise.resolve();

function runExclusive(fn) {
  const p = chain.then(() => fn());
  chain = p.then(
    () => undefined,
    () => undefined
  );
  return p;
}

module.exports = { runExclusive };
