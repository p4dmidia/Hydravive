
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1mWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log('🔍 Inspecionando colunas de affiliate_stats...');
  const { data: cols, error } = await supabase.rpc('get_table_columns', { t_name: 'affiliate_stats' });
  
  if (error) {
    // Se o RPC não existe, tentamos via query direta (pode falhar por RLS)
    console.log('RPC get_table_columns não disponível. Tentando via select vazio...');
    const { data, error: selErr } = await supabase.from('affiliate_stats').select('*').limit(0);
    if (selErr) {
      console.error('Erro ao inspecionar:', selErr.message);
    } else {
      console.log('Colunas encontradas:', Object.keys(data[0] || {}));
    }
  } else {
    console.log('Colunas:', cols);
  }
  
  console.log('🔍 Verificando os últimos 5 registros de commissions...');
  const { data: comms } = await supabase.from('commissions').select('*').order('created_at', { ascending: false }).limit(5);
  console.log('Últimas comissões:', comms);
}

inspectSchema();
