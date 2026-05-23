const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Dropping trigger on_auth_user_created_hydravive...');
  const dropTriggerQuery = 'DROP TRIGGER IF EXISTS on_auth_user_created_hydravive ON auth.users;';
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: dropTriggerQuery });
  
  if (error) {
    console.error('❌ Failed to drop trigger:', error);
  } else {
    console.log('✅ Trigger drop command executed successfully! Return data:', data);
  }

  console.log('Verifying remaining triggers in database...');
  const { data: triggers, error: trigErr } = await supabase.from('inspect_triggers').select('*');
  if (trigErr) {
    console.error('❌ Failed to inspect triggers:', trigErr);
  } else {
    console.log('✅ Triggers found in database after drop:');
    console.table(triggers);
  }
}

run();
