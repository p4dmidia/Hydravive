const url = 'https://tbdlesodfknorlxcumhd.supabase.co/rest/v1/';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

async function run() {
  try {
    const response = await fetch(url, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    const data = await response.json();
    console.log('Tables/Views:', Object.keys(data.paths).filter(p => !p.startsWith('/rpc')));
    console.log('RPCs:', Object.keys(data.paths).filter(p => p.startsWith('/rpc')));
  } catch (err) {
    console.error('Error fetching OpenAPI spec:', err.message);
  }
}

run();
