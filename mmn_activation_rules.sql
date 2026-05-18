-- ==================================================
-- ATIVAÇÃO MENSAL DE AFILIADOS - HYDRAVIVE
-- ==================================================

-- 1. Criar View para Status de Ativação Mensal
CREATE OR REPLACE VIEW public.affiliate_activation_status AS
SELECT 
    u.id AS user_id,
    u.full_name,
    -- Vendas no mês atual
    EXISTS (
        SELECT 1 
        FROM public.orders o
        WHERE o.affiliate_id = u.id 
          AND o.status = 'paid' 
          AND o.created_at >= date_trunc('month', now())
          AND o.created_at < date_trunc('month', now()) + interval '1 month'
    ) AS has_sale,
    -- Indicações no mês atual
    EXISTS (
        SELECT 1 
        FROM public.user_profiles ref
        WHERE ref.sponsor_id = u.id 
          AND ref.role = 'affiliate'
          AND ref.created_at >= date_trunc('month', now())
          AND ref.created_at < date_trunc('month', now()) + interval '1 month'
    ) AS has_referral,
    -- Conta ativada no mês
    (
        EXISTS (
            SELECT 1 
            FROM public.orders o
            WHERE o.affiliate_id = u.id 
              AND o.status = 'paid' 
              AND o.created_at >= date_trunc('month', now())
              AND o.created_at < date_trunc('month', now()) + interval '1 month'
        ) OR EXISTS (
            SELECT 1 
            FROM public.user_profiles ref
            WHERE ref.sponsor_id = u.id 
              AND ref.role = 'affiliate'
              AND ref.created_at >= date_trunc('month', now())
              AND ref.created_at < date_trunc('month', now()) + interval '1 month'
        )
    ) AS is_active_this_month
FROM public.user_profiles u;

-- 2. Atualizar Função do Motor de Comissões com Validação de Ativação
CREATE OR REPLACE FUNCTION public.process_mmn_commissions()
RETURNS TRIGGER AS $$
DECLARE
    current_sponsor_id BIGINT;
    current_level INTEGER := 1;
    commission_val NUMERIC;
    commission_type_val TEXT;
    commission_amount NUMERIC;
    v_total_points INTEGER := 0;
    v_sponsor_depth INTEGER;
    v_order_item RECORD;
BEGIN
    -- Só age se o status mudar para 'paid'
    IF (NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status <> 'paid')) THEN
        
        -- A. PROCESSAR PONTOS (Acumulado para o comprador se for afiliado)
        SELECT SUM(COALESCE(points_at_purchase, 0) * COALESCE(quantity, 1)) INTO v_total_points 
        FROM public.order_items WHERE order_id = NEW.id;

        IF v_total_points > 0 AND NEW.user_id IS NOT NULL THEN
            UPDATE public.affiliate_stats 
            SET points_balance = COALESCE(points_balance, 0) + v_total_points,
                monthly_points = COALESCE(monthly_points, 0) + v_total_points,
                updated_at = NOW()
            WHERE user_id = NEW.user_id;
        END IF;

        -- B. PROCESSAR BÔNUS DE INDICAÇÃO DIRETA (Nível 0 da cashback_config)
        IF NEW.affiliate_id IS NOT NULL THEN
            SELECT amount, commission_type INTO commission_val, commission_type_val 
            FROM public.cashback_config WHERE level = 0 AND is_active = true;
            
            IF commission_val IS NOT NULL AND commission_val > 0 THEN
                -- Bônus fixo ou percentual sobre o total do pedido
                IF commission_type_val = 'percentage' THEN
                    commission_amount := NEW.total_amount * commission_val / 100;
                ELSE
                    commission_amount := commission_val;
                END IF;

                UPDATE public.affiliate_stats 
                SET total_earnings = COALESCE(total_earnings, 0) + commission_amount,
                    available_balance = COALESCE(available_balance, 0) + commission_amount,
                    updated_at = NOW()
                WHERE user_id = NEW.affiliate_id;

                INSERT INTO public.commissions (order_id, affiliate_id, amount, level, status, created_at)
                VALUES (NEW.id, NEW.affiliate_id, commission_amount, 0, 'released', NOW());
            END IF;
        END IF;

        -- C. SUBIR REDE PARA COMISSÕES DE NÍVEL (1 a 10)
        IF NEW.affiliate_id IS NOT NULL THEN
            current_sponsor_id := NEW.affiliate_id;
        ELSE
            SELECT sponsor_id INTO current_sponsor_id 
            FROM public.user_profiles 
            WHERE id = NEW.user_id;
        END IF;

        WHILE current_sponsor_id IS NOT NULL AND current_level <= 10 LOOP
            
            -- Pega profundidade permitida da graduação atual do patrocinador (Para Pontos)
            SELECT g.network_depth INTO v_sponsor_depth
            FROM public.graduations g
            JOIN public.affiliate_stats s ON s.current_graduation_id = g.id
            WHERE s.user_id = current_sponsor_id;
            IF v_sponsor_depth IS NULL THEN v_sponsor_depth := 3; END IF;

            -- 1. PONTOS PARA A REDE
            IF current_level <= v_sponsor_depth AND v_total_points > 0 THEN
                UPDATE public.affiliate_stats 
                SET points_balance = COALESCE(points_balance, 0) + v_total_points,
                    monthly_points = COALESCE(monthly_points, 0) + v_total_points,
                    updated_at = NOW()
                WHERE user_id = current_sponsor_id;
            END IF;

            -- 2. COMISSÃO FINANCEIRA (Soma de todos os produtos do pedido)
            -- Apenas recebe comissão se o patrocinador estiver ativo no mês atual
            -- O patrocinador direto (NEW.affiliate_id) está ativo automaticamente por esta venda
            IF (current_sponsor_id = NEW.affiliate_id) OR EXISTS (
                SELECT 1 
                FROM public.orders o
                WHERE o.affiliate_id = current_sponsor_id 
                  AND o.status = 'paid' 
                  AND o.created_at >= date_trunc('month', now())
                  AND o.created_at < date_trunc('month', now()) + interval '1 month'
            ) OR EXISTS (
                SELECT 1 
                FROM public.user_profiles ref
                WHERE ref.sponsor_id = current_sponsor_id 
                  AND ref.role = 'affiliate'
                  AND ref.created_at >= date_trunc('month', now())
                  AND ref.created_at < date_trunc('month', now()) + interval '1 month'
            ) THEN
                commission_amount := 0;
                
                FOR v_order_item IN SELECT * FROM public.order_items WHERE order_id = NEW.id LOOP
                    -- Busca bônus específico do produto
                    SELECT amount, commission_type INTO commission_val, commission_type_val 
                    FROM public.product_commissions 
                    WHERE product_id = v_order_item.product_id AND level = current_level;

                    IF commission_val IS NOT NULL THEN
                        IF commission_type_val = 'percentage' THEN
                            commission_amount := commission_amount + ((v_order_item.price_at_purchase * v_order_item.quantity) * commission_val / 100);
                        ELSE
                            commission_amount := commission_amount + (commission_val * v_order_item.quantity);
                        END IF;
                    ELSE
                        -- Fallback para cashback_config global se não houver no produto
                        SELECT amount, commission_type INTO commission_val, commission_type_val 
                        FROM public.cashback_config 
                        WHERE level = current_level AND is_active = true;
                        
                        IF commission_val IS NOT NULL THEN
                            IF commission_type_val = 'percentage' THEN
                                commission_amount := commission_amount + ((v_order_item.price_at_purchase * v_order_item.quantity) * commission_val / 100);
                            ELSE
                                commission_amount := commission_amount + (commission_val * v_order_item.quantity);
                            END IF;
                        END IF;
                    END IF;
                END LOOP;

                -- Registrar Comissão se houver valor
                IF commission_amount > 0 THEN
                    UPDATE public.affiliate_stats 
                    SET total_earnings = COALESCE(total_earnings, 0) + commission_amount,
                        available_balance = COALESCE(available_balance, 0) + commission_amount,
                        updated_at = NOW()
                    WHERE user_id = current_sponsor_id;

                    INSERT INTO public.commissions (order_id, affiliate_id, amount, level, status, created_at)
                    VALUES (NEW.id, current_sponsor_id, commission_amount, current_level, 'released', NOW());
                END IF;
            END IF;

            -- Próximo da rede
            SELECT sponsor_id INTO current_sponsor_id FROM public.user_profiles WHERE id = current_sponsor_id;
            current_level := current_level + 1;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reinstalar a trigger para garantir a atualização
DROP TRIGGER IF EXISTS trigger_process_mmn_commissions ON public.orders;
CREATE TRIGGER trigger_process_mmn_commissions
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.process_mmn_commissions();

-- Conceder permissões para a view
GRANT SELECT ON public.affiliate_activation_status TO postgres, authenticated, service_role;
