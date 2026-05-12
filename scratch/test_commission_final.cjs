
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjM2OTEsImV4cCI6MjA5MzMzOTY5MX0.Sae_hjKvrSQSLTzUPpXAP5xEHNYvgU3qnShLLJui4zQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  const refCode = 'REF81B11';
  console.log('--- INICIANDO TESTE DE COMISSÃO (ANON) ---');
  
  // 1. Buscar Perfil
  const { data: profile, error: profError } = await supabase
    .from('user_profiles')
    .select('id, full_name')
    .eq('referral_code', refCode)
    .single();

  if (profError || !profile) {
    console.error('❌ Erro ao buscar perfil:', profError?.message || 'Não encontrado');
    return;
  }

  console.log('✅ Afiliado Encontrado:', profile.full_name, '(ID:', profile.id, ')');

  // 2. Criar Pedido
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      affiliate_id: profile.id,
      total_amount: 100.00,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) {
    console.error('❌ Erro ao criar pedido:', orderError.message);
    return;
  }

  console.log('✅ Pedido Criado:', order.id);

  // 3. Confirmar pagamento
  const { error: payError } = await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', order.id);

  if (payError) {
    console.error('❌ Erro ao pagar:', payError.message);
    return;
  }

  console.log('✅ Pagamento Confirmado! Verifique seu dashboard.');
}

runTest();
