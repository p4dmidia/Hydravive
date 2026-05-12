import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanAndCreate() {
  const email = 'admin@hydravive.com.br';
  const password = 'admin123';

  console.log(`--- CRIANDO ${email} VIA API ---`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: 'Administrador' }
    }
  });

  if (error) {
    console.error('❌ Erro:', error.message);
  } else {
    console.log('✅ Usuário criado com sucesso!');
    console.log('ID:', data.user?.id);
    console.log('\nAgora você pode logar no painel administrativo.');
  }
}

cleanAndCreate();
