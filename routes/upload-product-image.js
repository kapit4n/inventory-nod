const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const safeExt = allowed.includes(ext) ? ext : '.jpg';
    const base = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    cb(null, base + safeExt);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype);
    cb(ok ? null : new Error('INVALID_TYPE'), ok);
  },
});

function handleProductImageUpload(req, res) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.message === 'INVALID_TYPE') {
        return res.status(400).json({ error: 'Only JPEG, PNG, GIF, or WebP images are allowed.' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large (max 5 MB).' });
      }
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const url = `/uploads/products/${req.file.filename}`;
    res.json({ url });
  });
}

module.exports = handleProductImageUpload;
