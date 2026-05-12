import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl);
console.log('Key Length:', serviceRoleKey?.length);

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function test() {
  const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
  if (error) {
    console.error('Erro ao acessar banco:', error.message);
  } else {
    console.log('Conexão OK, dados:', data);
  }
}

test();
