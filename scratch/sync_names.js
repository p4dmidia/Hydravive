import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixData() {
  const sql = `
    -- 1. Atualizar seu nome real
    UPDATE public.user_profiles 
    SET full_name = 'Fernando Dominguez'
    WHERE mocha_user_id = '1ba30426-8aba-4243-be04-fdd104025846';

    -- 2. Criar usuários fictícios para o ranking
    INSERT INTO public.user_profiles (mocha_user_id, full_name, role)
    VALUES 
      ('user-fake-1', 'Mariana Silva', 'affiliate'),
      ('user-fake-2', 'Ricardo Oliveira', 'affiliate'),
      ('user-fake-3', 'Ana Costa', 'affiliate')
    ON CONFLICT DO NOTHING;

    -- 3. Dar pontos para eles aparecerem no ranking
    INSERT INTO public.affiliate_stats (user_id, referral_code, monthly_points)
    SELECT id, 'ref-' || id, floor(random() * 5000)
    FROM public.user_profiles 
    WHERE mocha_user_id IN ('user-fake-1', 'user-fake-2', 'user-fake-3')
    ON CONFLICT (user_id) DO UPDATE SET monthly_points = floor(random() * 5000);
    
    -- 4. Dar alguns pontos para você também
    UPDATE public.affiliate_stats 
    SET monthly_points = 1250
    WHERE user_id IN (SELECT id FROM public.user_profiles WHERE mocha_user_id = '1ba30426-8aba-4243-be04-fdd104025846');
  `
  
  console.log('--- EXECUTANDO ATUALIZAÇÃO DE DADOS ---')
  // Como não posso rodar SQL direto via JS sem RPC, o usuário deve rodar no SQL Editor
  console.log('POR FAVOR, RODAR ESTE SQL NO SEU SUPABASE DASHBOARD:')
  console.log(sql)
}

fixData()
