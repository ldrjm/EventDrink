import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

function calcAge(dateStr) {
  try {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  } catch (e) { return 0; }
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase admin credentials not provided. The register endpoint will return 500 until configured.');
}

app.post('/register', async (req, res) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY missing.' });
    }

    const { id, name, email, password, phone, birthDate, badge, role, createdAt } = req.body || {};
    if (!name || !email || !password || !birthDate) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const age = calcAge(birthDate);
    if (age < 18) return res.status(400).json({ error: 'Underage' });

    const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const payload = {
      id: id || undefined,
      name,
      email,
      password,
      phone: phone || null,
      birth_date: birthDate,
      role: role || 'VIP',
      created_at: createdAt || new Date().toISOString(),
    };

    const { data, error } = await supa.from('user_accounts').insert([payload]).select().single();
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message || 'Supabase error' });
    }

    return res.status(200).json({ success: true, account: data });
  } catch (err) {
    console.error('Unexpected error in /register:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`User register endpoint listening on http://localhost:${port}/register`));
}

export default app;
