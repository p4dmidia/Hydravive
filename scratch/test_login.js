import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testLogin() {
  console.log('--- TESTANDO LOGIN ---');
  const email = 'admin_hydra@hydravive.com.br';
  const password = 'admin123';

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.log('❌ FALHA NO LOGIN');
    console.log('Mensagem:', error.message);
    console.log('Status:', error.status);
    console.log('Código:', error.code);
  } else {
    console.log('✅ LOGIN REALIZADO COM SUCESSO!');
    console.log('User ID:', data.user?.id);
  }
}

testLogin();
