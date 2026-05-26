import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function activate() {
  console.log('Attempting to update user_profile id 122 (Breno Lopes) is_active to true...');
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ is_active: true })
    .eq('id', 122)
    .select();

  if (error) {
    console.error('Error updating profile:', error);
  } else {
    console.log('Update result:', data);
  }
}

activate();
