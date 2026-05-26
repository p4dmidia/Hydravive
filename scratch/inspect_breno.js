import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function inspect() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', 'brenolopes@gmail.com')
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
  } else {
    console.log('Breno Lopes Profile in DB:', {
      id: data.id,
      mocha_user_id: data.mocha_user_id,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      is_active: data.is_active
    });
  }
}

inspect();
