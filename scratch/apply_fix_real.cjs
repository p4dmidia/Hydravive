
const { createClient } = require('@supabase/supabase-js');

// CHAVES DO SEU PROJETO REAL (tbdleso...)
const supabaseUrl = 'https://tbdlesodfknorlxcumhd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZGxlc29kZmtub3JseGN1mWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2MzY5MSwiZXhwIjoyMDkzMzM5NjkxfQ.AtmPkssowRjrn2pcsURramqo6S_CTAJEn7_fdP_EstM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyFix() {
  console.log('🚀 Aplicando correção no projeto REAL (tbdleso...)...');
  
  const sql = `
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
    IF (NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status <> 'paid')) THEN
        IF NEW.user_id IS NOT NULL THEN
            SELECT SUM(COALESCE(points_at_purchase, 0) * COALESCE(quantity, 1)) INTO v_total_points 
            FROM public.order_items WHERE order_id = NEW.id;
            IF v_total_points > 0 THEN
                INSERT INTO public.affiliate_stats (user_id) VALUES (NEW.user_id) ON CONFLICT (user_id) DO NOTHING;
                UPDATE public.affiliate_stats SET points_balance = COALESCE(points_balance, 0) + v_total_points WHERE user_id = NEW.user_id;
            END IF;
        END IF;

        IF NEW.affiliate_id IS NOT NULL THEN
            current_sponsor_id := NEW.affiliate_id;
        ELSE
            SELECT sponsor_id INTO current_sponsor_id FROM public.user_profiles WHERE id = NEW.user_id;
        END IF;

        WHILE current_sponsor_id IS NOT NULL AND current_level <= 10 LOOP
            SELECT amount, COALESCE(commission_type, 'percentage') INTO commission_val, commission_type_val 
            FROM public.cashback_config WHERE level = current_level AND is_active = true;
            
            SELECT referral_code INTO sponsor_ref_code FROM public.user_profiles WHERE id = current_sponsor_id;

            IF commission_val IS NOT NULL AND commission_val > 0 AND sponsor_ref_code IS NOT NULL THEN
                IF commission_type_val = 'fixed' THEN commission_amount := commission_val;
                ELSE commission_amount := (NEW.total_amount * commission_val) / 100; END IF;

                INSERT INTO public.affiliate_stats (user_id, referral_code) VALUES (current_sponsor_id, sponsor_ref_code) ON CONFLICT (user_id) DO NOTHING;
                UPDATE public.affiliate_stats SET available_balance = COALESCE(available_balance, 0) + commission_amount WHERE user_id = current_sponsor_id;
                INSERT INTO public.commissions (order_id, affiliate_id, amount, level, status) VALUES (NEW.id, current_sponsor_id, commission_amount, current_level, 'released');
            END IF;
            SELECT sponsor_id INTO current_sponsor_id FROM public.user_profiles WHERE id = current_sponsor_id;
            current_level := current_level + 1;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_process_mmn_commissions ON public.orders;
CREATE TRIGGER trigger_process_mmn_commissions AFTER UPDATE OF status ON public.orders FOR EACH ROW EXECUTE FUNCTION public.process_mmn_commissions();
  `;

  // Como o cliente JS não roda SQL puro via RPC geralmente sem uma função auxiliar, 
  // vou tentar rodar um comando direto se houver uma função 'exec_sql' ou similar.
  // Caso contrário, informarei ao usuário.
  console.log('⚠️ Aviso: Tentando rodar via RPC se disponível...');
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('❌ Erro ao aplicar via RPC:', error.message);
    console.log('Como o RPC não existe, o usuário DEVE rodar o arquivo mmn_fix_migration.sql no painel do Supabase.');
  } else {
    console.log('✅ SUCESSO! Correção aplicada via RPC.');
  }
}

applyFix();
