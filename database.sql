-- HYDRAVIVE - SCRIPT DE BANCO DE DADOS (VERSÃO AFILIADOS)
-- Este script cria toda a estrutura necessária para o sistema de afiliados,
-- incluindo precificação dupla, sistema de pontos e comissionamento multinível.

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PERFIS DE USUÁRIO
-- Armazena dados complementares ao auth.users do Supabase
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    mocha_user_id text UNIQUE NOT NULL, -- ID vindo do Auth (UID)
    role text DEFAULT 'affiliate' CHECK (role IN ('affiliate', 'admin', 'customer')),
    is_active boolean DEFAULT true,
    full_name text,
    email text, -- Adicionado conforme realidade do banco
    referral_code text UNIQUE, -- Adicionado conforme realidade do banco
    avatar_url text,
    phone text,
    cpf text UNIQUE,
    pix_key text,
    sponsor_id bigint REFERENCES public.user_profiles(id), -- Patrocinador (Para MMN)
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. ESTATÍSTICAS E SALDOS DOS AFILIADOS
CREATE TABLE IF NOT EXISTS public.affiliate_stats (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id bigint REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
    referral_code text UNIQUE NOT NULL, -- Código de indicação (ex: bruno123)
    total_earnings numeric(12,2) DEFAULT 0.00, -- Ganhos totais históricos
    available_balance numeric(12,2) DEFAULT 0.00, -- Saldo disponível para saque
    frozen_balance numeric(12,2) DEFAULT 0.00, -- Saldo pendente de liberação
    total_withdrawals numeric(12,2) DEFAULT 0.00, -- Total já sacado
    points_balance integer DEFAULT 0, -- Pontos acumulados para TROCA/RESGATE
    monthly_points integer DEFAULT 0, -- Pontos do mês atual para RANKING (zerado todo mês)
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. CATEGORIAS DE PRODUTOS
CREATE TABLE IF NOT EXISTS public.product_categories (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    icon text,
    created_at timestamptz DEFAULT now()
);

-- 4. PRODUTOS
CREATE TABLE IF NOT EXISTS public.products (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    description text,
    price numeric(12,2) NOT NULL, -- Preço de Venda (Cliente)
    affiliate_price numeric(12,2) NOT NULL, -- Preço com Desconto (Afiliado)
    points_generated integer DEFAULT 0, -- Pontos que este produto gera ao ser vendido
    points_cost integer DEFAULT 0, -- Pontos necessários para RESGATAR este produto
    allow_points_redemption boolean DEFAULT false, -- Se permite ser trocado por pontos
    category_id bigint REFERENCES public.product_categories(id),
    rating integer DEFAULT 5,
    main_image_url text,
    tags text[],
    features text[],
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 5. IMAGENS ADICIONAIS DOS PRODUTOS
CREATE TABLE IF NOT EXISTS public.product_images (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id bigint REFERENCES public.products(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- 6. PEDIDOS
CREATE TABLE IF NOT EXISTS public.orders (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id bigint REFERENCES public.user_profiles(id),
    affiliate_id bigint REFERENCES public.user_profiles(id), -- Afiliado que fez a venda
    total_amount numeric(12,2) NOT NULL,
    total_points_used integer DEFAULT 0, -- Caso seja um pedido de resgate
    is_redemption boolean DEFAULT false, -- Identifica se é troca por pontos
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    payment_method text,
    shipping_address jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 7. ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS public.order_items (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id bigint REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id bigint REFERENCES public.products(id),
    quantity integer NOT NULL,
    price_at_purchase numeric(12,2) NOT NULL,
    points_at_purchase integer DEFAULT 0
);

-- 8. COMISSÕES (Suporte a Multinível)
CREATE TABLE IF NOT EXISTS public.commissions (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id bigint REFERENCES public.orders(id),
    affiliate_id bigint REFERENCES public.user_profiles(id),
    amount numeric(12,2) NOT NULL, -- Valor em R$
    points integer DEFAULT 0, -- Pontos gerados para a rede
    level integer DEFAULT 1, -- Nível na rede (1 = Direta, 2+ = Indireta)
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'released', 'cancelled')),
    released_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- 9. SOLICITAÇÕES DE SAQUE
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id bigint REFERENCES public.user_profiles(id),
    amount numeric(12,2) NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    pix_key text NOT NULL,
    processed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 10. MATERIAIS DE MARKETING
CREATE TABLE IF NOT EXISTS public.marketing_assets (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    type text CHECK (type IN ('image', 'video', 'document', 'banner')),
    category text CHECK (category IN ('Stories', 'Feed', 'Banners', 'Legal')),
    thumbnail_url text,
    file_url text,
    size text,
    format text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- FUNÇÕES E TRIGGERS

-- Função para atualizar timestamp de modificação
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para zerar pontos mensais (Ranking)
-- Deve ser chamada por um CRON JOB no dia 1 de cada mês
CREATE OR REPLACE FUNCTION public.reset_monthly_points()
RETURNS void AS $$
BEGIN
    UPDATE public.affiliate_stats SET monthly_points = 0;
END;
$$ LANGUAGE plpgsql;

-- Aplicação automática de updated_at
CREATE TRIGGER set_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_affiliate_stats_updated_at BEFORE UPDATE ON public.affiliate_stats FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_withdrawals_updated_at BEFORE UPDATE ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- SEGURANÇA (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_assets ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (Exemplos Básicos)
-- POLÍTICAS DE ACESSO
CREATE POLICY "Usuários podem ver todos os perfis" ON public.user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Público pode ver produtos ativos" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Usuários podem ver todas as estatísticas" ON public.affiliate_stats FOR SELECT TO authenticated USING (true);

-- DADOS INICIAIS (SEED)
INSERT INTO public.product_categories (name, slug, icon) VALUES 
('Purificadores', 'purificadores', 'Droplets'),
('Filtros', 'filtros', 'Filter');

INSERT INTO public.products (name, description, price, affiliate_price, points_generated, points_cost, allow_points_redemption, category_id, rating, main_image_url, tags, features) VALUES 
('Purificador X1 Pro', 'Filtragem de 7 estágios com tecnologia Mineralise+.', 1399.00, 980.00, 140, 2800, true, 1, 5, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMOayWLQFjHevLaBDG9dqt340yE4fhE4GwjAIS3vBJi25YFx210XprUPKkn35spWeV9WtHrKOw7MP0zE4exAuZYcMcnbmYadtn1Mhi5_pCQEhM47oEe83WMWT0Je-9_L93BNgx5CsX3jklbOB7qk5LZW1CN7feMmeCw5UYRGhCLW42_kpyKSFFHcVzy-iM8phC_-W5nuQWrqnRqumO0m1SCdlhc5egcC7nuI0ilh68e4ymp1n-OI_sLk970-cDcPtueqVwkjAQqjc', ARRAY['Mais Vendido', 'Premium'], ARRAY['7 Estágios', 'Mineralise+', 'Ultra Slim']),
('Garrafa HydraGo 750ml', 'Garrafa térmica com filtro integrado.', 249.00, 180.00, 25, 500, true, 1, 4, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-6GRTDwUikHQUUVNR6aFASo6GS4a9ywcWBfaxKPHbCzNDLu5NPsaHxw2VTG3rEU5tRxeuHCREcdXt8F_rYhoH6-ZOSN32hQZPndJVTBtgOEgW_J724m4YuuOvInsIxnk-yokTb8qmu028-vp4FXfvC2RtbR_8xg6VyMAC7QaG4nHOAmGMLAe23V_Q2LDHPe5vka-_sl-9een9ogVcYHBB9yLda9mane5qWLo9WXI40iFWPKy46qYif27yKvQqGxjWpmyba7ks7FI0TtPC_hinCC7k', ARRAY['Portátil'], ARRAY['Isolamento Duplo', 'Filtro Integrado', 'BPA Free']),
('Filtro de Reposição Ultra', 'Certificação NSF para 100% de eficiência.', 189.00, 130.00, 20, 400, true, 2, 5, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD677n5aKEIh05cCimu4_AlhKfpDsQoDJFUIdawsboVmO9qZRlk2pBLrepmUP1V17BG4wctbQr_VTzW2MuVyaPEjH78iUBc95NpFgBUPIbtxiEZuUbQwsmLRlUH9lRDk-Rs6AgNm6VrmKppm2zXwRuhfFqfYdq-OKNmykeWxrnSoxYJH0A0tDFihDgiI0p5nsTWb2rpv-aqhGUfcHe1F3ZpuHH2kWnh2ffvzor5vQyxtYGf-30HpDKvphX9VPaR_5gilrZmI4Q4sk0', ARRAY['Essencial'], ARRAY['Certificação NSF', 'Carvão Ativado']);
-- COMANDO PARA CRIAR A PASTA DE FOTOS (AVATARS)
-- COLE E RODE ISSO NO SEU SQL EDITOR DO SUPABASE
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'avatars');
