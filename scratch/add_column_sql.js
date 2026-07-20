import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function addColumn() {
  // Try sending SQL query to sql endpoint
  const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({ query: 'ALTER TABLE public.products ADD COLUMN IF NOT EXISTS max_installments INTEGER DEFAULT 0;' })
  });
  console.log('rpc exec_sql status:', res.status, await res.text());
}

addColumn();
