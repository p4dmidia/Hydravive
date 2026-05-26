-- Alterar valor padrão do is_active na tabela user_profiles para false
ALTER TABLE public.user_profiles ALTER COLUMN is_active SET DEFAULT false;
