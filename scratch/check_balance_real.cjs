
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjM2OTEsImV4cCI6MjA5MzMzOTY5MX0.Sae_hjKvrSQSLTzUPpXAP5xEHNYvgU3qnShLLJui4zQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBalance() {
  console.log('💰 Consultando Saldos Reais...');
  
  const { data: stats, error } = await supabase
    .from('affiliate_stats')
    .select('user_id, referral_code, available_balance, points_balance')
    .order('updated_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Erro na consulta:', error.message);
    return;
  }

  if (stats && stats.length > 0) {
    console.table(stats);
  } else {
    console.log('⚠️ Ninguém tem saldo no banco ainda.');
  }
}

checkBalance();
