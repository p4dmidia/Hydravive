import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

console.log('Supabase: Inicializando cliente...');
console.log('Supabase URL:', supabaseUrl ? 'Definida (' + supabaseUrl.substring(0, 20) + '...)' : 'ERRO: Indefinida');
console.log('Supabase Key:', supabaseAnonKey ? 'Definida (' + supabaseAnonKey.substring(0, 10) + '...)' : 'ERRO: Indefinida');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase: Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontradas!');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
