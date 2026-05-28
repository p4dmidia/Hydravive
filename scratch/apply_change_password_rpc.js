import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1bWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  const sql = `
    -- Permite que um administrador altere a senha de qualquer afiliado/usuário.
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
  `;

  console.log('Running exec_sql RPC to deploy password update function...');
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('Error running RPC:', error);
  } else {
    console.log('Success! SQL executed successfully. RPC Function admin_change_user_password created.', data);
  }
}

run();
