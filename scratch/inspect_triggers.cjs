const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const query = `
    SELECT 
        trigger_name, 
        event_manipulation, 
        event_object_table, 
        action_statement,
        action_orientation
    FROM information_schema.triggers;
  `;
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: query });
  if (error) {
    console.error('Error running query:', error);
  } else {
    console.log('Triggers found:');
    console.log(data);
  }

  // Also let's inspect functions
  const queryFunctions = `
    SELECT routine_name, routine_definition 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_name LIKE '%user%';
  `;
  const { data: functions, error: funcErr } = await supabase.rpc('exec_sql', { sql_query: queryFunctions });
  console.log('User functions:', functions || funcErr);
}

run();
