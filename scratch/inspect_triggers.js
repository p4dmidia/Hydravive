const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.rpc('get_table_columns', { t_name: 'user_profiles' });
  console.log('Columns of user_profiles:', data || error);

  // Let's run a query to get trigger definitions if possible, or just see how they are defined.
  // Wait, if we can run query on user_profiles directly
  const { data: users, error: uErr } = await supabase.from('user_profiles').select('*').limit(5);
  console.log('Sample profiles:', users || uErr);
}

run();
