const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Querying public.inspect_triggers view...');
  const { data, error } = await supabase.from('inspect_triggers').select('*');
  
  if (error) {
    console.error('❌ Failed to query inspect_triggers. Make sure you created the view in Supabase SQL Editor first!');
    console.error(error.message);
  } else {
    console.log('✅ Triggers found in database:');
    console.table(data);
  }
}

run();
