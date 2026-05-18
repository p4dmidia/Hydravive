import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Save, 
  Plus, 
  Trash2, 
  Percent, 
  DollarSign, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface MMNLevel {
  id?: number;
  level: number;
  amount: number;
  description: string;
  commission_type: 'percentage' | 'fixed';
  is_active: boolean;
}

export default function MMNConfig() {
  const [levels, setLevels] = useState<MMNLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cashback_config')
        .select('*')
        .order('level', { ascending: true });

      if (error) throw error;
      
      // Garantir que o nível 0 (Indicação Direta) exista se não estiver no banco
      const existing = data || [];
      const hasLevelZero = existing.some(l => l.level === 0);
      
      if (!hasLevelZero) {
        setLevels([
          { level: 0, amount: 400, description: 'Indicação Direta (Bônus Extra)', commission_type: 'fixed', is_active: true },
          ...existing
        ]);
      } else {
        setLevels(existing);
      }
    } catch (error: any) {
      toast.error('Erro ao carregar configurações MMN');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLevel = () => {
    const nextLevel = Math.max(...levels.map(l => l.level), 0) + 1;
    const newLevel: MMNLevel = {
      level: nextLevel,
      amount: 0,
      description: `Comissão Nível ${nextLevel}`,
      commission_type: 'percentage',
      is_active: true
    };
    setLevels([...levels, newLevel]);
  };

  const handleRemoveLevel = (index: number) => {
    if (levels[index].level === 0) return toast.error('O bônus de indicação direta não pode ser removido');
    if (levels.length <= 1) return toast.error('É necessário ter pelo menos 1 nível');
    const newLevels = levels.filter((_, i) => i !== index);
    setLevels(newLevels);
  };

  const updateLevelField = (index: number, field: keyof MMNLevel, value: any) => {
    const newLevels = [...levels];
    newLevels[index] = { ...newLevels[index], [field]: value };
    setLevels(newLevels);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // REMOVEMOS O ID PARA EVITAR ERRO 400 NO UPSERT
      const payload = levels.map(l => ({
        level: l.level,
        amount: l.amount,
        description: l.description,
        commission_type: l.commission_type,
        is_active: true,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('cashback_config')
        .upsert(payload, { onConflict: 'level' });

      if (error) throw error;

      // Limpeza de níveis removidos (mantendo o 0)
      const maxLevel = Math.max(...levels.map(l => l.level));
      await supabase.from('cashback_config').delete().gt('level', maxLevel);

      toast.success('Configurações salvas com sucesso!');
      fetchLevels();
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + (error.details || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <GitBranch className="text-primary size-8" />
              Configurações MMN - INDICAÇÃO
            </h2>
            <p className="text-slate-500 mt-1">Defina o bônus de indicação direta e os ganhos por nível da rede.</p>
          </div>
          <button 
            onClick={saveChanges}
            disabled={isSaving || loading}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Salvar Alterações
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando níveis...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {levels.map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center gap-8 group transition-all ${item.level === 0 ? 'bg-primary/5 border-primary/20 shadow-xl shadow-primary/5' : 'bg-[#1E293B] border-white/5 hover:border-primary/30'}`}
              >
                <div className={`size-20 rounded-[2rem] border flex flex-col items-center justify-center shrink-0 shadow-inner transition-colors ${item.level === 0 ? 'bg-primary/20 border-primary/30' : 'bg-[#0F172A] border-white/5 group-hover:bg-primary/10'}`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Nível</p>
                  <p className={`text-3xl font-black leading-none ${item.level === 0 ? 'text-primary' : 'text-white'}`}>{item.level}</p>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{item.level === 0 ? 'Bônus de Indicação Direta' : 'Descrição do Ganho'}</label>
                  <input 
                    type="text" 
                    value={item.description}
                    onChange={(e) => updateLevelField(index, 'description', e.target.value)}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="shrink-0 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">Tipo</label>
                  <div className="bg-[#0F172A] p-1.5 rounded-2xl border border-white/5 flex items-center gap-1">
                    <button 
                      onClick={() => updateLevelField(index, 'commission_type', 'percentage')}
                      className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${item.commission_type === 'percentage' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                      <Percent className="size-3" /> %
                    </button>
                    <button 
                      onClick={() => updateLevelField(index, 'commission_type', 'fixed')}
                      className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${item.commission_type === 'fixed' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                      <DollarSign className="size-3" /> R$
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-32 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Valor</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={item.amount}
                      onChange={(e) => updateLevelField(index, 'amount', Number(e.target.value))}
                      className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-black text-center outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">
                      {item.commission_type === 'percentage' ? '%' : 'R$'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 lg:pt-6">
                  {item.level !== 0 && (
                    <button 
                      onClick={() => handleRemoveLevel(index)}
                      className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5 active:scale-95"
                    >
                      <Trash2 className="size-6" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button 
              onClick={handleAddLevel}
              className="w-full py-8 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-slate-600 hover:border-primary/50 hover:text-primary transition-all group"
            >
              <Plus className="size-6" />
              <span className="font-black uppercase tracking-widest text-[10px]">Adicionar Novo Nível de Profundidade</span>
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
