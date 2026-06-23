const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://postgres:bNSNTtz,9fu6f-w@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL...');

    const sqlPath = path.join(__dirname, 'supabase/migrations/001_create_pricing_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration...');
    await client.query(sql);
    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

runMigration();
