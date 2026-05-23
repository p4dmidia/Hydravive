const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, cpf, phone, referral_code, is_active');
    
  if (error) {
    console.error('Error fetching profiles:', error);
  } else {
    console.log('All profiles in DB:');
    console.log(profiles);
  }
}

run();
