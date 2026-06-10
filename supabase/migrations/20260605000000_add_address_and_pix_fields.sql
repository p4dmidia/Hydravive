-- Migração para adicionar campos de endereço e tipo de chave pix à tabela user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS pix_type text,
ADD COLUMN IF NOT EXISTS cep text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS number text,
ADD COLUMN IF NOT EXISTS complement text;
