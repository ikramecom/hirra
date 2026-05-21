#!/usr/bin/env node
/**
 * Apply HIRRA legacy Supabase migrations 001→004 against an EMPTY Postgres database
 * (file order matches the migration prefix sort order).
 *
 * Connection string (Supabase Dashboard → Project Settings → Database):
 * Use the DIRECT connection (typically port 5432, host db.<ref>.supabase.co).
 * Pooler/session mode sometimes works for DDL; if a statement fails, try direct.
 *
 *   set DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres
 *   npm run db:apply-migrations
 *
 * Rollback-ish smoke check (runs in a transaction, then rolls back — no persisted rows):
 *   npm run db:apply-migrations -- --smoke
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import pkg from 'pg';

const { Client } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIGRATIONS = [
  '001_initial_schema.sql',
  '002_rls_policies.sql',
  '003_indexes.sql',
  '004_seed_data.sql',
];

function sslOption(connectionString) {
  try {
    const u = new URL(connectionString.replace(/^postgresql:/i, 'postgres:'));
    const host = u.hostname ?? '';
    if (host === 'localhost' || host === '127.0.0.1') return false;
  } catch {
    // fall through — default to TLS for remote hosts
  }
  return { rejectUnauthorized: true };
}

async function runSmokeTransactional(client) {
  const prod = await client.query(
    `select p.id as product_id, v.id as variant_id,
            p.name_ar, p.name_en, v.name_ar as var_ar, v.name_en as var_en, p.price_sar
       from products p
       join product_variants v on v.product_id = p.id
      where p.slug = 'hirra-pro-roller' and v.sku = 'HRR-PRO-001-OLV'
      limit 1`,
  );
  if (prod.rows.length === 0) {
    throw new Error('Smoke check: seeded roller + Olive variant not found.');
  }
  const {
    product_id,
    variant_id,
    name_ar,
    name_en,
    var_ar,
    var_en,
    price_sar,
  } = prod.rows[0];

  await client.query('BEGIN');

  try {
    const phone = '+966512345677';
    const cust = await client.query(
      `insert into customers (phone, name, city, street_address)
       values ($1, $2, $3, $4)
       on conflict (phone) do update set name = excluded.name
       returning id`,
      [
        phone,
        'Smoke Test',
        'riyadh',
        'Riyadh Test Address Enough Words Three Here',
      ],
    );

    const customerId = cust.rows[0].id;
    const subtotal = Number(price_sar);
    const shipping = subtotal >= 199 ? 0 : 18;
    const codFee = 10;
    const total = subtotal + shipping + codFee;

    const ord = await client.query(
      `insert into orders (
        customer_id, customer_phone, customer_name,
        shipping_city, shipping_address,
        subtotal_sar, shipping_sar, cod_fee_sar, discount_sar, total_sar,
        payment_method, status, fake_score, fake_flags
      ) values (
        $1, $2, $3,
        $4, $5,
        $6, $7, $8, $9, $10,
        'cod', 'pending_confirmation', $11, '{}'::text[]
      ) returning id, order_number`,
      [
        customerId,
        phone,
        'Smoke Test',
        'riyadh',
        'Riyadh Test Address Enough Words Three Here',
        subtotal,
        shipping,
        codFee,
        0,
        total,
        0,
      ],
    );

    const orderId = ord.rows[0].id;

    await client.query(
      `insert into order_items (
        order_id, product_id, product_variant_id, bundle_id,
        product_name_ar, product_name_en, variant_name_ar, variant_name_en,
        unit_price_sar, quantity, line_total_sar
      ) values (
        $1, $2, $3, null,
        $4, $5, $6, $7,
        $8, 1, $8
      )`,
      [orderId, product_id, variant_id, name_ar, name_en, var_ar, var_en, Number(price_sar)],
    );

    await client.query('ROLLBACK');
    console.log(
      `\nSmoke check OK (same shape as order-confirm commits; rolled back). Example order_number would have been "${ord.rows[0].order_number}".`,
    );
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  }
}

async function main() {
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    console.error(
      'DATABASE_URL missing. Paste the Postgres URI from Supabase → Settings → Database (direct / port 5432).',
    );
    process.exit(1);
  }

  const smoke = process.argv.includes('--smoke');

  const dir = path.join(__dirname, '..', 'supabase', 'migrations');
  const client = new Client({
    connectionString: conn,
    ssl: sslOption(conn),
  });

  await client.connect();
  console.log('Applying migrations in order:\n  ' + MIGRATIONS.join('\n  '));

  for (const name of MIGRATIONS) {
    const fp = path.join(dir, name);
    if (!fs.existsSync(fp)) {
      throw new Error(`Missing migration file: ${fp}`);
    }
    const sql = fs.readFileSync(fp, 'utf8');
    console.log(`\n── ${name} ──`);
    await client.query(sql);
    console.log('OK');
  }

  const { rows } = await client.query(
    `
    select tablename
      from pg_tables
     where schemaname = 'public'
  order by tablename`,
  );
  console.log('\nPublic tables (' + rows.length + '):');
  console.log(rows.map((r) => r.tablename).join(', '));

  const { rows: products } = await client.query(
    `select slug, name_en from products order by display_order`,
  );
  console.log('\nProducts (' + products.length + '): ' + products.map((p) => p.slug).join(', '));

  const { rows: bundles } = await client.query(
    `select slug from bundles order by display_order`,
  );
  console.log('Bundles (' + bundles.length + '): ' + bundles.map((b) => b.slug).join(', '));

  if (smoke) {
    await runSmokeTransactional(client);
  }

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
