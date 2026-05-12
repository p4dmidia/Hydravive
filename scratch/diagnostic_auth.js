import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnostic() {
  console.log('--- DIAGNÓSTICO DE AUTENTICAÇÃO ---');
  console.log('Testando registro de usuário via API...');
  
  const testEmail = `diagnostic_${Date.now()}@test.com`;
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'Password123!',
  });

  if (error) {
    console.log('❌ ERRO CAPTURADO:', error.message);
    console.log('Status:', error.status);
    console.log('Código:', error.code);
  } else {
    console.log('✅ Sucesso no registro! O problema pode ser específico do usuário admin.');
  }
}

diagnostic();
