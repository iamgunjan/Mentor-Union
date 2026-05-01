import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import Org from './models/Org.js';
import Mentor from './models/Mentor.js';
import Mentee from './models/Mentee.js';
import User from './models/User.js';
import Ticket from './models/Ticket.js';
import Invoice from './models/Invoice.js';
import Payout from './models/Payout.js';
import AuditLog from './models/AuditLog.js';

import { crudRouter } from './routes/crud.js';

const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorunion';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', async (_req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  });
});

app.use('/api/orgs', crudRouter(Org, { searchFields: ['name', 'admin', 'domain'] }));
app.use('/api/mentors', crudRouter(Mentor, { searchFields: ['name', 'country'] }));
app.use('/api/mentees', crudRouter(Mentee, { searchFields: ['name', 'org', 'cohort'] }));
app.use('/api/users', crudRouter(User, { searchFields: ['name', 'email', 'org'] }));
app.use('/api/tickets', crudRouter(Ticket, { searchFields: ['title', 'org', 'category'] }));
app.use('/api/invoices', crudRouter(Invoice, { searchFields: ['org', 'code'] }));
app.use('/api/payouts', crudRouter(Payout, { searchFields: ['mentor', 'cycle'] }));
app.use('/api/auditlog', crudRouter(AuditLog, { searchFields: ['who', 'action', 'object'] }));

// Convenience: append-only audit endpoint used by the action engine.
app.post('/api/audit', async (req, res, next) => {
  try {
    const doc = await AuditLog.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

app.use((err, _req, res, _next) => {
  console.error('[api error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log('[mongo] connected:', MONGODB_URI.replace(/:[^:@/]+@/, ':***@'));
  app.listen(PORT, () => console.log(`[api] http://localhost:${PORT}`));
}

start().catch((e) => {
  console.error('[fatal] failed to start:', e);
  process.exit(1);
});
