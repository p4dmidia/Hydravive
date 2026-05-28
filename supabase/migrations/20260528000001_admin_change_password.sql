-- =========================================================================
-- ALTERAÇÃO DE SENHA POR ADMINISTRADOR - HYDRAVIVE
-- =========================================================================
-- Permite que um administrador altere a senha de qualquer afiliado/usuário.
-- Esta função é SECURITY DEFINER para poder alterar a tabela auth.users.

CREATE OR REPLACE FUNCTION public.admin_change_user_password(
  target_mocha_user_id text,
  new_password text
)
RETURNS boolean
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Validar se quem está executando é de fato um administrador
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem alterar senhas.';
  END IF;

  -- 2. Garantir parâmetros não nulos/vazios
  IF target_mocha_user_id IS NULL OR target_mocha_user_id = '' THEN
    RAISE EXCEPTION 'ID do usuário não fornecido.';
  END IF;

  IF new_password IS NULL OR length(new_password) < 6 THEN
    RAISE EXCEPTION 'A senha deve conter pelo menos 6 caracteres.';
  END IF;

  -- 3. Atualizar a senha criptografada na tabela auth.users (usando pgcrypto gen_salt('bf'))
  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_password, gen_salt('bf', 10)),
    updated_at = now()
  WHERE id = target_mocha_user_id::uuid;

  RETURN true;
END;
$$ LANGUAGE plpgsql;
