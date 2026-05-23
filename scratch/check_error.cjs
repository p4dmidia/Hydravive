const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching sample row from user_profiles...');
  const { data: profs, error: profsErr } = await supabase.from('user_profiles').select('*').limit(1);
  if (profsErr) {
    console.error('Error fetching user_profiles:', profsErr);
  } else {
    console.log('Columns of user_profiles:', Object.keys(profs[0] || {}));
    console.log('Sample profile row:', profs[0]);
  }

  console.log('Fetching sample row from affiliate_stats...');
  const { data: stats, error: statsErr } = await supabase.from('affiliate_stats').select('*').limit(1);
  if (statsErr) {
    console.error('Error fetching affiliate_stats:', statsErr);
  } else {
    console.log('Columns of affiliate_stats:', Object.keys(stats[0] || {}));
    console.log('Sample stats row:', stats[0]);
  }
}

run();
