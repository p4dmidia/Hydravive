
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  console.log('Iniciando reparo do Miguel no banco REAL...');
  const v_user_id = '6feb9fac-e1e2-4e0e-a926-2b62ff2ae628';
  const v_email = 'migueloliveira10@gmail.com';

  // 1. Forçar Perfil
  const { data: profile, error: pErr } = await supabase
    .from('user_profiles')
    .upsert({
      mocha_user_id: v_user_id,
      email: v_email,
      full_name: 'Miguel Oliveira',
      role: 'affiliate'
    }, { onConflict: 'email' })
    .select()
    .single();

  if (pErr) return console.error('Erro no Perfil:', pErr);
  console.log('Perfil OK! ID:', profile.id);

  // 2. Forçar Estatísticas
  const { error: sErr } = await supabase
    .from('affiliate_stats')
    .upsert({
      user_id: profile.id,
      referral_code: 'MIGUEL10'
    }, { onConflict: 'user_id' });

  if (sErr) console.error('Erro nas Stats:', sErr);
  else console.log('Estatísticas OK!');

  console.log('REPARO CONCLUÍDO!');
}

fix();
