
-- ==========================================
-- CORREÇÃO DEFINITIVA DE COMISSÕES MMN
-- ==========================================

-- 1. Limpa funções e triggers antigas
DROP TRIGGER IF EXISTS trigger_process_mmn_commissions ON public.orders;

CREATE OR REPLACE FUNCTION public.process_mmn_commissions()
RETURNS TRIGGER AS $$
DECLARE
    current_sponsor_id BIGINT;
    current_level INTEGER := 1;
    commission_val NUMERIC;
    commission_type_val TEXT;
    commission_amount NUMERIC;
    sponsor_ref_code TEXT;
    v_total_points INTEGER := 0;
BEGIN
    -- Só age se o status mudar para 'paid'
    IF (NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status <> 'paid')) THEN
        
        -- A. PROCESSAR PONTOS
        IF NEW.user_id IS NOT NULL THEN
            SELECT SUM(COALESCE(points_at_purchase, 0) * COALESCE(quantity, 1)) INTO v_total_points 
            FROM public.order_items WHERE order_id = NEW.id;

            IF v_total_points > 0 THEN
                INSERT INTO public.affiliate_stats (user_id) VALUES (NEW.user_id) ON CONFLICT (user_id) DO NOTHING;
                UPDATE public.affiliate_stats 
                SET points_balance = COALESCE(points_balance, 0) + v_total_points,
                    monthly_points = COALESCE(monthly_points, 0) + v_total_points,
                    updated_at = NOW()
                WHERE user_id = NEW.user_id;
            END IF;
        END IF;

        -- B. DEFINIR PONTO DE PARTIDA (Nível 1)
        IF NEW.affiliate_id IS NOT NULL THEN
            current_sponsor_id := NEW.affiliate_id;
        ELSE
            SELECT sponsor_id INTO current_sponsor_id 
            FROM public.user_profiles 
            WHERE id = NEW.user_id;
        END IF;

        -- C. SUBIR REDE
        WHILE current_sponsor_id IS NOT NULL AND current_level <= 10 LOOP
            
            -- Pega configuração do admin
            SELECT amount, COALESCE(commission_type, 'percentage') INTO commission_val, commission_type_val 
            FROM public.cashback_config 
            WHERE level = current_level AND is_active = true;
            
            -- Pega código do recebedor
            SELECT referral_code INTO sponsor_ref_code FROM public.user_profiles WHERE id = current_sponsor_id;

            IF commission_val IS NOT NULL AND commission_val > 0 AND sponsor_ref_code IS NOT NULL THEN
                
                -- Cálculo
                IF commission_type_val = 'fixed' THEN
                    commission_amount := commission_val;
                ELSE
                    commission_amount := (NEW.total_amount * commission_val) / 100;
                END IF;

                -- Atualiza Saldo
                INSERT INTO public.affiliate_stats (user_id, referral_code)
                VALUES (current_sponsor_id, sponsor_ref_code)
                ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW();

                UPDATE public.affiliate_stats 
                SET total_earnings = COALESCE(total_earnings, 0) + commission_amount,
                    available_balance = COALESCE(available_balance, 0) + commission_amount,
                    updated_at = NOW()
                WHERE user_id = current_sponsor_id;

                -- Registra Extrato
                INSERT INTO public.commissions (order_id, affiliate_id, amount, level, status, created_at)
                VALUES (NEW.id, current_sponsor_id, commission_amount, current_level, 'released', NOW());
            END IF;

            -- Próximo da rede
            SELECT sponsor_id INTO current_sponsor_id FROM public.user_profiles WHERE id = current_sponsor_id;
            current_level := current_level + 1;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Reinstala a trigger
CREATE TRIGGER trigger_process_mmn_commissions
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.process_mmn_commissions();

-- 3. Garante permissões
GRANT ALL ON public.affiliate_stats TO postgres, service_role;
GRANT ALL ON public.commissions TO postgres, service_role;
