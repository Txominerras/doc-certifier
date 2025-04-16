import express from 'express';
import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post('/', upload.single('document'), (req, res) => {
  const filePath = req.file.path;
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  
  fs.unlinkSync(filePath);

  res.json({ hash });
});

export default router;
