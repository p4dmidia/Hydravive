import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
// Correct service role key from drop_duplicate_trigger.cjs
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  const sql = `
    -- 1. Criar função de segurança para verificar se o usuário é admin sem recursão
    CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS boolean SECURITY DEFINER AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE mocha_user_id = auth.uid()::text AND role = 'admin'
      );
    END;
    $$ LANGUAGE plpgsql;

    -- 2. Limpar políticas de atualização antigas se houver
    DROP POLICY IF EXISTS "Admins podem gerenciar todos os perfis" ON public.user_profiles;
    DROP POLICY IF EXISTS "Usuários podem atualizar o próprio perfil" ON public.user_profiles;
    DROP POLICY IF EXISTS "Usuários podem atualizar dados básicos" ON public.user_profiles;

    -- 3. Criar política para admins gerenciarem todos os perfis (SELECT, INSERT, UPDATE, DELETE)
    CREATE POLICY "Admins podem gerenciar todos os perfis" ON public.user_profiles
      FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());

    -- 4. Criar política para usuários normais atualizar o próprio perfil
    CREATE POLICY "Usuários podem atualizar o próprio perfil" ON public.user_profiles
      FOR UPDATE
      TO authenticated
      USING (mocha_user_id = auth.uid()::text)
      WITH CHECK (mocha_user_id = auth.uid()::text);

    -- 5. Forçar ativação de Breno Lopes
    UPDATE public.user_profiles SET is_active = true WHERE email = 'brenolopes@gmail.com';
  `;

  console.log('Running exec_sql RPC with correct service role key...');
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('Error running RPC:', error);
  } else {
    console.log('Success! SQL executed successfully. Result:', data);
  }
}

run();
