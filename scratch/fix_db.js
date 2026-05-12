import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Carregar .env da raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erro: Chaves não encontradas no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log(`Conectando ao projeto: ${supabaseUrl}`)
  
  // Script para criar as tabelas e colunas no banco NOVO
  const sql = `
    -- Criar tabela de perfis
    CREATE TABLE IF NOT EXISTS public.user_profiles (
      id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      mocha_user_id text UNIQUE NOT NULL,
      full_name text,
      role text DEFAULT 'affiliate',
      is_active boolean DEFAULT true,
      avatar_url text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Criar tabela de estatísticas
    CREATE TABLE IF NOT EXISTS public.affiliate_stats (
      id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id bigint REFERENCES public.user_profiles(id) ON DELETE CASCADE,
      referral_code text UNIQUE NOT NULL,
      available_balance numeric DEFAULT 0,
      frozen_balance numeric DEFAULT 0,
      total_earnings numeric DEFAULT 0,
      points_balance integer DEFAULT 0,
      monthly_points integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Inserir o seu perfil
    INSERT INTO public.user_profiles (mocha_user_id, full_name, role)
    VALUES ('1ba30426-8aba-4243-be04-fdd104025846', 'Bruno', 'affiliate')
    ON CONFLICT (mocha_user_id) DO UPDATE SET full_name = 'Bruno';

    -- Inserir estatísticas para você
    INSERT INTO public.affiliate_stats (user_id, referral_code)
    SELECT id, 'bruno' || floor(random()*1000)
    FROM public.user_profiles 
    WHERE mocha_user_id = '1ba30426-8aba-4243-be04-fdd104025846'
    ON CONFLICT DO NOTHING;
  `

  // Como o supabase-js não tem .sql() direto, vamos tentar rodar via RPC ou avisar o usuário
  // Mas aqui, como estamos configurando do zero, o ideal é rodar via SQL Editor.
  // Vou tentar usar o comando 'execute_sql' do MCP passando os parâmetros corretos se ele aceitar URL
  // Mas como ele não aceita, vou gerar o SQL final para VOCÊ colar no Dashboard do Supabase.
  
  console.log('--- COPIE E COLE O SQL ABAIXO NO SQL EDITOR DO SEU SUPABASE (PROJETO NOVO) ---')
  console.log(sql)
}

setupDatabase()
