import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  ExternalLink,
  Calendar,
  User,
  DollarSign,
  Loader2,
  Clock,
  CheckCircle,
  Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface Withdrawal {
  id: number;
  amount_requested: number;
  fee_amount: number;
  net_amount: number;
  status: 'pending' | 'paid' | 'rejected';
  pix_key: string;
  created_at: string;
  user: {
    full_name: string;
    phone: string;
  };
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'all'>('pending');
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select(`
          *,
          user:user_id (full_name, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar saques');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: 'paid' | 'rejected') => {
    setIsProcessing(id);
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ 
          status, 
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar localmente para refletir a mudança de aba
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
      toast.success(status === 'paid' ? 'Saque marcado como pago!' : 'Saque rejeitado');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    } finally {
      setIsProcessing(null);
    }
  };

  const copyPixKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Chave PIX copiada!');
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    if (activeTab === 'all') return true;
    return w.status === activeTab;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Wallet className="text-primary size-8" />
              Gestão de Saques
            </h2>
            <p className="text-slate-500 mt-1">Aprovação e controle de pagamentos de comissões.</p>
          </div>

          <div className="bg-[#1E293B] p-1.5 rounded-2xl border border-white/5 flex items-center gap-1">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
            >
              Pendentes
            </button>
            <button 
              onClick={() => setActiveTab('paid')}
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'paid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
            >
              Pagos
            </button>
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
            >
              Todos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sincronizando financeiro...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWithdrawals.length === 0 ? (
              <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                <Filter className="size-12 text-slate-700 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Nenhuma solicitação nesta categoria</p>
              </div>
            ) : (
              filteredWithdrawals.map((item) => (
                <div key={item.id} className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center gap-8 group hover:border-primary/30 transition-all">
                  
                  {/* Status e Data */}
                  <div className="shrink-0 flex flex-col items-center lg:items-start gap-2">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : item.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      <div className={`size-1.5 rounded-full ${item.status === 'pending' ? 'bg-amber-500 animate-pulse' : item.status === 'paid' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {item.status === 'pending' ? 'Pendente' : item.status === 'paid' ? 'Pago' : 'Rejeitado'}
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="size-3" />
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  {/* Afiliado */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-[#0F172A] border border-white/5 flex items-center justify-center text-white font-black text-xl shadow-inner">
                        {item.user?.full_name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-black uppercase tracking-tight text-lg line-clamp-1">{item.user?.full_name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.user?.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Chave PIX */}
                  <div className="flex-[1.5] w-full lg:w-auto">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Chave PIX (Recebimento)</p>
                    <div className="bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between group/pix">
                      <code className="text-white font-black text-sm truncate">{item.pix_key}</code>
                      <button 
                        onClick={() => copyPixKey(item.pix_key)}
                        className="p-2 text-slate-500 hover:text-primary transition-colors"
                      >
                        <Copy className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="shrink-0 text-center lg:text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Valor Líquido</p>
                    <p className="text-emerald-500 font-black text-3xl">R$ {Number(item.net_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Taxa: R$ {Number(item.fee_amount).toLocaleString('pt-BR')}</p>
                  </div>

                  {/* Ações */}
                  {item.status === 'pending' && (
                    <div className="flex items-center gap-3 shrink-0">
                      <button 
                        onClick={() => handleUpdateStatus(item.id, 'paid')}
                        disabled={isProcessing === item.id}
                        className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isProcessing === item.id ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                        Pagar
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(item.id, 'rejected')}
                        disabled={isProcessing === item.id}
                        className="p-4 bg-white/5 text-red-500 rounded-2xl border border-white/5 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        <XCircle className="size-5" />
                      </button>
                    </div>
                  )}

                  {item.status === 'paid' && (
                    <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                      <CheckCircle className="size-4" />
                      Pagamento Realizado
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
