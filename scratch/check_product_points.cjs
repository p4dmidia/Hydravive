
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjM2OTEsImV4cCI6MjA5MzMzOTY5MX0.Sae_hjKvrSQSLTzUPpXAP5xEHNYvgU3qnShLLJui4zQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductPoints() {
  console.log('🔍 Verificando pontuação dos produtos...');
  const { data: products, error } = await supabase.from('products').select('id, name, points');
  
  if (error) {
    console.error('Erro:', error.message);
    return;
  }

  if (products) {
    console.table(products);
  }
}

checkProductPoints();
