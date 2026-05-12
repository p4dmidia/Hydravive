import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fullTest() {
  const testEmail = `test_${Date.now()}@example.com`;
  const password = 'Password123!';

  console.log(`1. Criando usuário de teste: ${testEmail}`);
  const { error: signUpError } = await supabase.auth.signUp({ email: testEmail, password });
  
  if (signUpError) {
    console.log('❌ Erro no SignUp:', signUpError.message);
    return;
  }
  console.log('✅ Usuário criado.');

  console.log('2. Tentando logar com o usuário recém-criado...');
  const { error: signInError } = await supabase.auth.signInWithPassword({ email: testEmail, password });

  if (signInError) {
    console.log('❌ Erro no SignIn (500):', signInError.message);
  } else {
    console.log('✅ Login funcionou perfeitamente!');
  }
}

fullTest();
