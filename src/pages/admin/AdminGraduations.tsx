import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Save, 
  Loader2,
  ChevronRight,
  Target,
  Layers,
  Gift
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface Graduation {
  id: number;
  name: string;
  points_target: number;
  network_depth: number;
  reward: string;
  level_order: number;
}

export default function AdminGraduations() {
  const [graduations, setGraduations] = useState<Graduation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchGraduations();
  }, []);

  const fetchGraduations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('graduations')
        .select('*')
        .order('level_order', { ascending: true });

      if (error) throw error;
      setGraduations(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar graduações');
    } finally {
      setLoading(false);
    }
  };

  const updateGradField = (index: number, field: keyof Graduation, value: any) => {
    const newGrads = [...graduations];
    newGrads[index] = { ...newGrads[index], [field]: value };
    setGraduations(newGrads);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // Execute individual updates in parallel to avoid "cannot insert a non-DEFAULT value into column 'id'"
      const updatePromises = graduations.map(g => 
        supabase
          .from('graduations')
          .update({
            name: g.name,
            points_target: g.points_target,
            network_depth: g.network_depth,
            reward: g.reward,
            level_order: g.level_order
          })
          .eq('id', g.id)
      );

      const results = await Promise.all(updatePromises);
      
      const firstError = results.find(r => r.error)?.error;
      if (firstError) throw firstError;

      toast.success('Regras de graduação atualizadas!');
      fetchGraduations();
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + (error.message || error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Trophy className="text-primary size-8" />
              Graduações e Metas
            </h2>
            <p className="text-slate-500 mt-1">Configure os níveis de qualificação e as recompensas por desempenho.</p>
          </div>
          <button 
            onClick={saveChanges}
            disabled={isSaving || loading}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Salvar Regras
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando planos...</p>
          </div>
        ) : graduations.length === 0 ? (
          <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center gap-6">
            <div className="size-20 rounded-full bg-slate-800 flex items-center justify-center">
              <Trophy className="size-10 text-slate-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase">Nenhuma Graduação Encontrada</h3>
              <p className="text-slate-500 mt-2 max-w-md">Certifique-se de ter executado o script SQL ou clique no botão abaixo para criar as graduações padrão.</p>
            </div>
            <button 
              onClick={async () => {
                const defaults = [
                  { name: 'Afiliado', points_target: 0, network_depth: 3, reward: '', level_order: 0 },
                  { name: 'Líder Sênior', points_target: 10000, network_depth: 4, reward: '1 Notebook', level_order: 1 },
                  { name: 'Líder Executivo', points_target: 12000, network_depth: 5, reward: '1 Projetor', level_order: 2 },
                  { name: 'Líder Master', points_target: 18000, network_depth: 6, reward: '1 Celular', level_order: 3 },
                  { name: 'Coordenador', points_target: 25000, network_depth: 7, reward: '1 Viagem nacional', level_order: 4 },
                  { name: 'Coordenador Premium', points_target: 35000, network_depth: 8, reward: '1 Cruzeiro nacional', level_order: 5 },
                  { name: 'Coordenador Black', points_target: 50000, network_depth: 9, reward: '1 Moto 0km', level_order: 6 },
                  { name: 'Black Diamond', points_target: 200000, network_depth: 10, reward: '1 Carro (R$ 100k)', level_order: 7 }
                ];
                const { error } = await supabase.from('graduations').insert(defaults);
                if (error) toast.error('Erro ao inicializar: ' + error.message);
                else { toast.success('Graduações inicializadas!'); fetchGraduations(); }
              }}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all"
            >
              Inicializar Graduações Padrão
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {graduations.map((item, index) => (
              <div key={item.id} className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center gap-8 group hover:border-primary/30 transition-all">
                <div className="size-16 rounded-2xl bg-[#0F172A] border border-white/5 flex flex-col items-center justify-center shrink-0 shadow-inner group-hover:bg-primary/10 transition-colors">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Nível</p>
                  <p className="text-2xl font-black text-white leading-none">{item.level_order}</p>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome da Graduação</label>
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => updateGradField(index, 'name', e.target.value)}
                      className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Target className="size-3" /> Meta de Pontos
                    </label>
                    <input 
                      type="number" 
                      value={item.points_target}
                      onChange={(e) => updateGradField(index, 'points_target', Number(e.target.value))}
                      className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Layers className="size-3" /> Profundidade (Níveis)
                    </label>
                    <input 
                      type="number" 
                      value={item.network_depth}
                      onChange={(e) => updateGradField(index, 'network_depth', Number(e.target.value))}
                      className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Gift className="size-3" /> Prêmio
                    </label>
                    <input 
                      type="text" 
                      value={item.reward || ''}
                      onChange={(e) => updateGradField(index, 'reward', e.target.value)}
                      className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-5 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Sem prêmio"
                    />
                  </div>
                </div>

                {index < graduations.length - 1 && (
                  <div className="hidden lg:block">
                    <ChevronRight className="size-6 text-slate-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
