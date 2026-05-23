-- =========================================================================
-- FLUXO DE APROVAÇÃO DE AFILIADOS - HYDRAVIVE
-- =========================================================================
-- Execute este script no SQL Editor do seu Supabase Dashboard para aplicar
-- a lógica de novos usuários inativos por padrão (aguardando aprovação).

-- 1. Alterar o padrão do campo is_active para FALSE na tabela de perfis
-- Isso garante que, por padrão, as contas não fiquem ativas imediatamente
ALTER TABLE public.user_profiles ALTER COLUMN is_active SET DEFAULT false;

-- 2. Atualizar ou Criar a função de gatilho que processa o cadastro vindo do Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_sponsor_id bigint;
    v_ref_code text;
    v_role text := 'affiliate';
    v_is_active boolean := false;
    v_user_id bigint;
BEGIN
    -- Se o e-mail for do domínio corporativo ou for o gerente, aprovar automaticamente como admin
    IF new.email LIKE '%@hydravive.com.br' OR new.email = 'gerencia@hydravive.com.br' THEN
        v_role := 'admin';
        v_is_active := true;
    END IF;

    -- Obter o ID do patrocinador/sponsor a partir do sponsor_code (código de indicação)
    IF new.raw_user_meta_data->>'sponsor_code' IS NOT NULL THEN
        SELECT id INTO v_sponsor_id 
        FROM public.user_profiles 
        WHERE UPPER(referral_code) = UPPER(new.raw_user_meta_data->>'sponsor_code');
    END IF;

    -- Gerar um código de indicação único para o novo afiliado
    v_ref_code := 'REF' || UPPER(SUBSTRING(md5(random()::text) FROM 1 FOR 8));

    -- Inserir o perfil do usuário
    INSERT INTO public.user_profiles (
        mocha_user_id,
        full_name,
        email,
        role,
        is_active,
        phone,
        cpf,
        pix_key,
        referral_code,
        sponsor_id
    ) VALUES (
        new.id::text, -- Cast explícito para text
        COALESCE(new.raw_user_meta_data->>'firstName', '') || ' ' || COALESCE(new.raw_user_meta_data->>'lastName', ''),
        new.email,
        v_role,
        v_is_active,
        new.raw_user_meta_data->>'whatsapp',
        new.raw_user_meta_data->>'cpfCnpj',
        new.raw_user_meta_data->>'pixKey',
        v_ref_code,
        v_sponsor_id
    ) RETURNING id INTO v_user_id; -- Armazena o ID inserido diretamente

    -- Criar as estatísticas iniciais vinculadas ao perfil recém-criado usando o v_user_id
    INSERT INTO public.affiliate_stats (
        user_id,
        referral_code
    ) VALUES (
        v_user_id,
        v_ref_code
    ) ON CONFLICT (user_id) DO NOTHING;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Garantir que a trigger na tabela auth.users está ativa e executando a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_hydravive ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

