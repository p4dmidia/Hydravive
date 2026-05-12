import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  HelpCircle, 
  Shield, 
  Mail, 
  Phone,
  DollarSign,
  Trophy,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;
      
      console.log('--- DIAGNÓSTICO DE CONFIGURAÇÕES ---');
      console.log('Linhas encontradas:', data?.length);
      console.log('Conteúdo do Banco:', data);

      setSettings(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = (key: string, value: string) => {
    const exists = settings.find(s => s.key === key);
    if (exists) {
      setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
    } else {
      setSettings([...settings, { key, value, description: '', id: 0 } as any]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert(settings.map(s => ({
          key: s.key,
          value: s.value,
          updated_at: new Date().toISOString()
        })), { onConflict: 'key' });

      if (error) throw error;
      toast.success('Configurações aplicadas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações: ' + (error.message || 'Verifique o console'));
    } finally {
      setIsSaving(false);
    }
  };

  const getSetting = (key: string) => settings.find(s => s.key === key);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Settings className="text-primary size-8" />
              Configurações Globais - TESTE
            </h2>
            <p className="text-slate-500 mt-1">Gerencie parâmetros estratégicos e regras do sistema.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Salvar Tudo
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Seção Financeira */}
            <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <DollarSign className="size-4 text-emerald-500" />
                  Regras Financeiras
                </h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Valor Mínimo para Saque (R$)</label>
                  <input 
                    type="number" 
                    value={getSetting('min_withdrawal')?.value || ''}
                    onChange={(e) => handleUpdateSetting('min_withdrawal', e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-bold"
                    placeholder="Ex: 50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Taxa de Saque (R$ ou %)</label>
                  <input 
                    type="text" 
                    value={getSetting('withdrawal_fee')?.value || ''}
                    onChange={(e) => handleUpdateSetting('withdrawal_fee', e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-bold"
                    placeholder="Ex: 5.00"
                  />
                </div>
              </div>
            </div>

            {/* Seção de Pontuação */}
            <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Trophy className="size-4 text-primary" />
                  Ranking e Pontuação
                </h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">R$ para 1 Ponto (Conversão)</label>
                  <input 
                    type="number" 
                    value={getSetting('points_conversion_rate')?.value || ''}
                    onChange={(e) => handleUpdateSetting('points_conversion_rate', e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mínimo para Ativação Mensal (Pts)</label>
                  <input 
                    type="number" 
                    value={getSetting('min_monthly_points')?.value || ''}
                    onChange={(e) => handleUpdateSetting('min_monthly_points', e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    placeholder="Ex: 100"
                  />
                </div>
              </div>
            </div>

            {/* Suporte e Contato */}
            <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <HelpCircle className="size-4 text-blue-500" />
                  Informações de Suporte
                </h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Phone className="size-3" /> WhatsApp Suporte
                  </label>
                  <input 
                    type="text" 
                    value={getSetting('support_whatsapp')?.value || ''}
                    onChange={(e) => handleUpdateSetting('support_whatsapp', e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold"
                    placeholder="+55 (00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Mail className="size-3" /> E-mail de Contato
                  </label>
                  <input 
                    type="email" 
                    value={getSetting('support_email')?.value || ''}
                    onChange={(e) => handleUpdateSetting('support_email', e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold"
                    placeholder="suporte@hydravive.com.br"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 flex gap-4 items-start">
          <AlertTriangle className="size-6 text-amber-500 shrink-0 mt-1" />
          <div className="text-sm text-amber-200/60 leading-relaxed">
            <p className="font-bold text-amber-500 mb-1">Cuidado!</p>
            Alterar as taxas de saque ou conversão de pontos afeta o equilíbrio financeiro da rede imediatamente. Certifique-se de que as mudanças foram comunicadas aos afiliados.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
