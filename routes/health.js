var express = require('express');
var router = express.Router();

/**
 * GET /api/health — liveness/readiness probe.
 *
 * Exists for the desktop shell (Tauri), which starts this API as a child
 * process and must know when it is genuinely ready before it opens the POS
 * window. A listening socket is not enough: the routes are only mounted after
 * Express finishes booting, and a shell that races that would show a first
 * paint full of failed requests.
 *
 * Deliberately dependency-free and unauthenticated: it must answer before any
 * client is configured, and it exposes nothing but process liveness. No
 * database is touched, so a probe cannot be the thing that fails on a slow
 * disk. See scripts/run-tauri.sh and docs/architecture/tauri-progress.md.
 */
router.get('/health', function (req, res) {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
