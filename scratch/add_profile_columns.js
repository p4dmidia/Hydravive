import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  const sql = `
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS pix_type text,
ADD COLUMN IF NOT EXISTS cep text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS number text,
ADD COLUMN IF NOT EXISTS complement text;
  `;

  console.log('Tentando rodar SQL via RPC no Supabase...');
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.log('\n========================================================================');
    console.log('⚠️ IMPORTANTE: O RPC "exec_sql" não existe no Supabase (esperado).');
    console.log('Você precisa copiar o SQL abaixo e colar no SQL Editor do seu painel do Supabase:');
    console.log('------------------------------------------------------------------------');
    console.log(sql.trim());
    console.log('------------------------------------------------------------------------');
    console.log('URL do SQL Editor: https://supabase.com/dashboard/project/tbdlesodfknorlxcumhd/sql/new');
    console.log('========================================================================\n');
  } else {
    console.log('✅ SUCESSO! As colunas de endereço foram criadas no banco via RPC!');
  }
}

run();
