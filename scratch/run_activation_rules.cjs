const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1mWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Executando migração de ativação no Supabase...');
  
  const sqlPath = path.join(__dirname, '../mmn_activation_rules.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Tentando chamar RPC exec_sql...');
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('❌ Erro ao rodar via RPC:', error.message);
    console.log('\n========================================================================');
    console.log('⚠️ IMPORTANTE: O RPC "exec_sql" falhou ou não existe no Supabase.');
    console.log('Você precisará copiar o conteúdo do arquivo "mmn_activation_rules.sql"');
    console.log('e colar no SQL Editor do seu painel do Supabase para aplicar no banco!');
    console.log('========================================================================\n');
  } else {
    console.log('✅ SUCESSO! A view e a trigger de ativação foram aplicadas com sucesso!');
  }
}

runMigration();
