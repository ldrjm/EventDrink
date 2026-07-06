import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const sqlFile = path.resolve(process.cwd(), 'seed.sql');
const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error(
    'Erro: defina DATABASE_URL ou SUPABASE_DB_URL no seu .env para conectar ao banco de dados. ' +
    'Use a string de conexão Postgres do Supabase, não a chave anon.'
  );
  process.exit(1);
}

const sql = fs.readFileSync(sqlFile, 'utf8');

async function ensureUserAccountsPasswordColumn(client) {
  const { rowCount } = await client.query(
    `select column_name
     from information_schema.columns
     where table_schema = 'public'
       and table_name = 'user_accounts'
       and column_name = 'password'`
  );

  if (rowCount === 0) {
    console.log('Ajustando schema: adicionando coluna password em public.user_accounts...');
    await client.query(`alter table public.user_accounts add column password text;`);
    await client.query(`update public.user_accounts set password = '' where password is null;`);
  }
}

async function runSeed() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Conectado ao banco de dados. Executando seed...');
    await ensureUserAccountsPasswordColumn(client);
    await client.query(sql);
    console.log('Seed executado com sucesso.');
  } catch (error) {
    console.error('Erro ao executar seed:', error.message || error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();
