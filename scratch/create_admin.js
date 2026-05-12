import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Erro: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const email = 'admin@hydravive.com.br';
  const password = 'admin123';

  console.log(`Verificando usuário ${email} em ${supabaseUrl}...`);

  // 1. Tentar encontrar o usuário
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Erro ao listar usuários:', listError.message);
    return;
  }

  let user = users.find(u => u.email === email);

  if (user) {
    console.log('Usuário já existe. Atualizando senha...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: password,
      email_confirm: true
    });
    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError.message);
      return;
    }
  } else {
    console.log('Usuário não existe. Criando...');
    const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Administrador' }
    });
    if (createError) {
      console.error('Erro ao criar usuário:', createError.message);
      return;
    }
    user = newUser;
  }

  console.log('Usuário Auth OK. Configurando perfil...');

  // 2. Upsert no user_profiles
  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert({
      mocha_user_id: user.id,
      email: email,
      role: 'admin',
      full_name: 'Administrador',
      is_active: true
    }, { onConflict: 'mocha_user_id' });

  if (profileError) {
    console.error('Erro ao configurar perfil:', profileError.message);
    console.log('Tentando verificar se a tabela existe...');
    const { error: testError } = await supabase.from('user_profiles').select('id').limit(1);
    if (testError) {
      console.error('A tabela user_profiles não parece existir ou é inacessível:', testError.message);
    }
  } else {
    console.log('Perfil de administrador configurado com sucesso!');
  }
}

createAdmin();
