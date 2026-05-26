const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  console.log('Updating Breno Lopes status to active using service role key...');
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ is_active: true })
    .eq('email', 'brenolopes@gmail.com')
    .select();

  if (error) {
    console.error('Error updating status:', error);
  } else {
    console.log('Update success! Result:', data);
  }
}

run();
