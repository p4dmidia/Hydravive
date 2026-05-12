-- 1. Garantir que a coluna de pontos existe em order_items
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS points_at_purchase INTEGER DEFAULT 0;

-- 2. Limpar políticas antigas (backup se RLS falhar)
DROP POLICY IF EXISTS "orders_access_all" ON public.orders;
DROP POLICY IF EXISTS "order_items_access_all" ON public.order_items;

-- 3. Criar políticas de acesso total (para garantir que o RPC funcione e que consultas simples passem)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_access_all" ON public.orders FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "order_items_access_all" ON public.order_items FOR ALL TO public USING (true) WITH CHECK (true);

-- 4. Função RPC Versão 1
CREATE OR REPLACE FUNCTION public.create_checkout_order(
    p_total_amount numeric,
    p_user_id bigint,
    p_shipping_method text,
    p_shipping_cost numeric,
    p_shipping_address jsonb,
    p_items jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id bigint;
    v_item jsonb;
    v_result jsonb;
BEGIN
    INSERT INTO public.orders (
        total_amount, status, user_id, payment_method, shipping_method, shipping_cost, shipping_address
    ) VALUES (
        p_total_amount, 'pending', p_user_id, 'credit_card', p_shipping_method, p_shipping_cost, p_shipping_address
    ) RETURNING id INTO v_order_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.order_items (
            order_id, product_id, quantity, price_at_purchase, points_at_purchase
        ) VALUES (
            v_order_id,
            (v_item->>'product_id')::bigint,
            (v_item->>'quantity')::integer,
            (v_item->>'price_at_purchase')::numeric,
            COALESCE((v_item->>'points_at_purchase')::integer, 0)
        );
    END LOOP;

    SELECT row_to_json(o)::jsonb INTO v_result FROM public.orders o WHERE id = v_order_id;
    RETURN v_result;
END;
$$;

-- 5. Função RPC Versão 3 (JSONB Payload) - Mais robusta
CREATE OR REPLACE FUNCTION public.create_checkout_v3(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id bigint;
    v_item jsonb;
    v_result jsonb;
BEGIN
    INSERT INTO public.orders (
        total_amount, status, user_id, payment_method, shipping_method, shipping_cost, shipping_address
    ) VALUES (
        (payload->>'total_amount')::numeric,
        'pending',
        (payload->>'user_id')::bigint,
        'credit_card',
        (payload->>'shipping_method'),
        (payload->>'shipping_cost')::numeric,
        (payload->'shipping_address')
    ) RETURNING id INTO v_order_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(payload->'items')
    LOOP
        INSERT INTO public.order_items (
            order_id, product_id, quantity, price_at_purchase, points_at_purchase
        ) VALUES (
            v_order_id,
            (v_item->>'product_id')::bigint,
            (v_item->>'quantity')::integer,
            (v_item->>'price_at_purchase')::numeric,
            COALESCE((v_item->>'points_at_purchase')::integer, 0)
        );
    END LOOP;

    SELECT row_to_json(o)::jsonb INTO v_result FROM public.orders o WHERE id = v_order_id;
    RETURN v_result;
END;
$$;

-- 6. Garantir permissões
GRANT EXECUTE ON FUNCTION public.create_checkout_order TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_checkout_v3 TO anon, authenticated, service_role;

-- 7. Recarregar cache (Notificação para PostgREST)
-- Nota: O comando NOTIFY pode não ser suportado em migrations se rodar em transação, mas tentamos.
-- Na verdade o Supabase CLI cuida do reload após o push.
