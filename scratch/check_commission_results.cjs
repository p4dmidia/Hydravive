
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjM2OTEsImV4cCI6MjA5MzMzOTY5MX0.Sae_hjKvrSQSLTzUPpXAP5xEHNYvgU3qnShLLJui4zQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkResults() {
  console.log('--- VERIFICANDO ÚLTIMO PEDIDO ---');
  
  // 1. Pegar o último pedido pago
  const { data: lastOrder } = await supabase
    .from('orders')
    .select('id, total_amount, status')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!lastOrder) return console.error('Nenhum pedido encontrado.');
  console.log(`Pedido #${lastOrder.id} - Status: ${lastOrder.status}`);

  // 2. Ver se a comissão foi criada
  const { data: comms } = await supabase
    .from('commissions')
    .select('*')
    .eq('order_id', lastOrder.id);

  if (comms && comms.length > 0) {
    console.log('✅ SUCESSO! Comissão Gerada:', comms.length, 'níveis encontrados.');
    comms.forEach(c => {
      console.log(`Nível ${c.level}: R$ ${c.amount} para Afiliado ${c.affiliate_id}`);
    });
  } else {
    console.error('❌ ERRO: Nenhuma comissão gerada para este pedido no banco.');
  }
}

checkResults();
