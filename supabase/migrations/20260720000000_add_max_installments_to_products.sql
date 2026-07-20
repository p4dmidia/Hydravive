-- Migration to add max_installments column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS max_installments INTEGER DEFAULT 0;
