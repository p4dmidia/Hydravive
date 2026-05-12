import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testAnyLogin() {
  const email = `login_test_${Date.now()}@example.com`;
  const password = 'Password123!';

  console.log('1. Registrando novo usuário de teste...');
  const { error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) {
    console.error('❌ Erro no SignUp:', signUpError.message);
    return;
  }

  console.log('2. Tentando LOGAR com este novo usuário...');
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  
  if (signInError) {
    console.error('❌ Erro no SignIn (500):', signInError.message);
  } else {
    console.log('✅ LOGIN FUNCIONOU! O problema é específico do usuário Admin.');
  }
}

testAnyLogin();
