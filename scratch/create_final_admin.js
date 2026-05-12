import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function createFinalAdmin() {
  const email = 'gerencia@hydravive.com.br';
  const password = 'admin123';

  console.log(`1. Registrando ${email} via SignUp...`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: 'Gerente Administrador' }
    }
  });

  if (error) {
    console.error('❌ Erro no SignUp:', error.message);
    return;
  }

  const userId = data.user?.id;
  console.log('✅ Usuário registrado ID:', userId);

  console.log('2. Tentando logar imediatamente para validar...');
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    console.error('❌ Erro no Login (500):', signInError.message);
  } else {
    console.log('✅ LOGIN FUNCIONOU!');
    console.log('Agora você pode usar esse e-mail no painel administrativo.');
  }
}

createFinalAdmin();
