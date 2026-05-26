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

-- 4. Criar política para usuários normais atualizarem seus próprios perfis
CREATE POLICY "Usuários podem atualizar o próprio perfil" ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (mocha_user_id = auth.uid()::text)
  WITH CHECK (mocha_user_id = auth.uid()::text);

-- 5. Habilitar o tempo real (Realtime) para a tabela de perfis
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
  END IF;
END $$;
