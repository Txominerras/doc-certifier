// server/app.js
import express from 'express';
import cors from 'cors';
import hashRoute from './routes/hash.js';
import documentsRoute from './routes/documents.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

console.log("📌 RPC:", process.env.RPC_URL);
console.log("📌 CONTRACT_ADDRESS:", process.env.CONTRACT_ADDRESS);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use('/api/hash', hashRoute);
app.use('/api/documents', documentsRoute);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});