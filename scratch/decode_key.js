import dotenv from 'dotenv';
dotenv.config();

const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.log('No key found in env!');
} else {
  const parts = key.split('.');
  console.log('Header:', Buffer.from(parts[0], 'base64').toString('utf8'));
  console.log('Payload:', Buffer.from(parts[1], 'base64').toString('utf8'));
}
