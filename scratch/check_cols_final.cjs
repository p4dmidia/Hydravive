
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjM2OTEsImV4cCI6MjA5MzMzOTY5MX0.Sae_hjKvrSQSLTzUPpXAP5xEHNYvgU3qnShLLJui4zQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log('🔍 Verificando nomes das colunas em affiliate_stats...');
  
  // Tenta buscar um registro qualquer para ver os nomes das colunas
  const { data, error } = await supabase.from('affiliate_stats').select('*').limit(1);

  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log('✅ Colunas encontradas:', Object.keys(data[0]));
  } else {
    // Se estiver vazia, tentamos inserir uma linha de teste e ver o erro ou sucesso
    console.log('⚠️ Tabela vazia. Tentando descrever via RPC ou erro de insert...');
    const { error: insErr } = await supabase.from('affiliate_stats').insert({ user_id: 999999 });
    console.log('Mensagem do banco:', insErr?.message);
  }
}

checkColumns();
