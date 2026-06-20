const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'aws-1-us-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.zbxnadgqarloklefhrph',
  password: 'gCORMflt5ctKf5nq',
  ssl: { rejectUnauthorized: false }
});

const createSQL = `
CREATE TABLE IF NOT EXISTS public.family_members (
  id text PRIMARY KEY,
  name text NOT NULL,
  gender text NOT NULL,
  side text NOT NULL DEFAULT 'paternal',
  role text DEFAULT '',
  birth_year integer,
  occupation text DEFAULT '',
  interests text DEFAULT '',
  description text DEFAULT '',
  photo_url text DEFAULT '',
  parent_ids text[] DEFAULT '{}',
  spouse_id text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
`;

const rlsSQL = [
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='family_members' AND policyname='public read') THEN
      CREATE POLICY "public read" ON public.family_members FOR SELECT USING (true);
    END IF;
  END $$;`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='family_members' AND policyname='service write') THEN
      CREATE POLICY "service write" ON public.family_members FOR ALL USING (true) WITH CHECK (true);
    END IF;
  END $$;`
];

async function main() {
  await client.connect();
  console.log('Connected to Supabase');

  await client.query(createSQL);
  console.log('Table ready');

  for (const sql of rlsSQL) {
    await client.query(sql);
  }
  console.log('RLS policies applied');

  const { members } = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/members.json'), 'utf-8'));
  let inserted = 0;
  for (const m of members) {
    const { rowCount } = await client.query(
      `INSERT INTO public.family_members
        (id, name, gender, side, role, birth_year, occupation, interests, description, photo_url, parent_ids, spouse_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO NOTHING`,
      [m.id, m.name, m.gender, m.side, m.role || '',
       m.birthYear || null, m.occupation || '', m.interests || '',
       m.description || '', m.photoUrl || '',
       m.parentIds || [], m.spouseId || '']
    );
    if (rowCount) inserted++;
  }
  console.log(`Seeded ${inserted} / ${members.length} members`);
  await client.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
