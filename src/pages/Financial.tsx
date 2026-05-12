import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Download,
  Plus,
  AlertCircle,
  Calendar,
  Loader2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'commission' | 'withdrawal';
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
  description: string;
}

export default function FinancialPage() {
  const { profile, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'ganhos' | 'saques'>('todos');
  
  // Withdrawal window logic (05 to 10)
  const today = new Date();
  const currentDay = today.getDate();
  const isWithdrawalWindow = currentDay >= 5 && currentDay <= 10;

  useEffect(() => {
    if (authLoading) return;
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // Timeout de segurança para não travar no carregamento
      const timeout = setTimeout(() => setLoading(false), 3000);

      try {
        setLoading(true);
        
        // 1. Fetch Stats
        const { data: statsData, error: statsError } = await supabase
          .from('affiliate_stats')
          .select('*')
          .eq('user_id', profile.id)
          .single();

        if (statsError && statsError.code !== 'PGRST116') throw statsError;
        setStats(statsData);

        // 2. Fetch Transactions (Combined from commissions and withdrawals)
        const [commissionsRes, withdrawalsRes] = await Promise.allSettled([
          supabase
            .from('commissions')
            .select('id, amount, status, created_at, order_id, level')
            .eq('affiliate_id', profile.id),
          supabase
            .from('withdrawals')
            .select('id, amount, status, created_at')
            .eq('user_id', profile.id)
        ]);

        const commissionsData = commissionsRes.status === 'fulfilled' ? commissionsRes.value.data : [];
        const withdrawalsData = withdrawalsRes.status === 'fulfilled' ? withdrawalsRes.value.data : [];

        const combinedTxs: Transaction[] = [
          ...(commissionsData || []).map(c => ({
            id: `comm-${c.id}`,
            type: 'commission' as const,
            amount: Number(c.amount),
            status: (c.status === 'released' ? 'approved' : c.status === 'pending' ? 'pending' : 'rejected') as 'approved' | 'pending' | 'rejected',
            created_at: c.created_at,
            description: c.order_id 
              ? `Comissão Pedido #${c.order_id} (${c.level === 1 ? 'Direta' : `Nível ${c.level}`})`
              : `Bônus Extra (${c.level === 1 ? 'Direto' : `Nível ${c.level}`})`
          })),
          ...(withdrawalsData || []).map(w => ({
            id: `with-${w.id}`,
            type: 'withdrawal' as const,
            amount: Number(w.amount),
            status: (w.status === 'paid' ? 'approved' : w.status === 'pending' ? 'pending' : 'rejected') as 'approved' | 'pending' | 'rejected',
            created_at: w.created_at,
            description: 'Saque de Saldo para Conta PIX'
          }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const filtered = activeFilter === 'todos' ? combinedTxs :
                         activeFilter === 'ganhos' ? combinedTxs.filter(t => t.type === 'commission') :
                         combinedTxs.filter(t => t.type === 'withdrawal');

        setTransactions(filtered);

      } catch (err) {
        console.error('Error fetching financial data:', err);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.id, authLoading, activeFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  if (loading || authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="size-12 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-10 max-w-[1400px] mx-auto space-y-8 md:space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-[#111618] text-2xl md:text-4xl font-black tracking-tighter uppercase">Gestão Financeira</h2>
            <div className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${isWithdrawalWindow ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <p className="text-xs md:text-sm text-slate-500 font-semibold uppercase tracking-widest">
                Janela de Saque: {isWithdrawalWindow ? 'Aberta' : 'Fechada'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <button 
              disabled={!isWithdrawalWindow}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              <Plus className="size-5" />
              <span>Solicitar Novo Saque</span>
            </button>
            {!isWithdrawalWindow && (
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest flex items-center gap-1">
                <AlertCircle className="size-3" />
                Saques permitidos apenas do dia 05 ao dia 10
              </p>
            )}
          </div>
        </div>

        {/* Withdrawal Info Alert */}
        {!isWithdrawalWindow && (
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6 border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Calendar className="size-8 text-primary" />
            </div>
            <div className="flex-1 space-y-1 text-center md:text-left relative z-10">
              <h3 className="text-lg font-black uppercase tracking-tight">Período de Solicitação de Saque</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
                Para garantir a segurança e agilidade nos pagamentos, as solicitações de saque ocorrem mensalmente entre os dias <span className="text-white font-bold">05 e 10</span>. Fora deste período, o botão permanecerá desabilitado.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Clock className="size-32" />
            </div>
          </div>
        )}

        {/* Balance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/10">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-10 md:size-12 rounded-2xl bg-primary flex items-center justify-center">
                  <Wallet className="size-5 md:size-6 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Saldo Disponível</span>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-1 font-black">
                  {formatCurrency(stats?.available_balance)}
                </h3>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  Atualizado em tempo real
                </p>
              </div>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Configurar Chave PIX
              </button>
            </div>
            <div className="absolute top-0 right-0 p-10 text-white/5 opacity-50 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
              <TrendingUp className="size-48" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-10 md:size-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Clock className="size-5 md:size-6 text-amber-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saldo a Liberar</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
                {formatCurrency(stats?.frozen_balance)}
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6">Sujeito a prazos de garantia</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-10 md:size-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <CheckCircle2 className="size-5 md:size-6 text-slate-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Sacado</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
                {formatCurrency(stats?.total_withdrawals)}
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6">Histórico Total da Conta</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-6 md:p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-slate-900">Extrato de Movimentações</h3>
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
              {['todos', 'ganhos', 'saques'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === filter ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Data</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 font-right">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${tx.type === 'commission' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                        {tx.type === 'commission' ? <ArrowDownLeft className="size-5" /> : <ArrowUpRight className="size-5" />}
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-slate-700 text-sm">{tx.description}</td>
                    <td className="px-6 py-6 text-slate-400 font-medium text-xs">
                      {new Date(tx.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-6 font-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        tx.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        tx.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {tx.status === 'approved' && <CheckCircle2 className="size-3" />}
                        {tx.status === 'pending' && <Clock className="size-3" />}
                        {tx.status === 'rejected' && <XCircle className="size-3" />}
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-10 py-6 text-right font-black text-sm ${tx.type === 'commission' ? 'text-emerald-500' : 'text-slate-900'}`}>
                      {tx.type === 'commission' ? `+ ${formatCurrency(tx.amount)}` : `- ${formatCurrency(tx.amount)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-500 text-sm font-bold">Nenhuma movimentação encontrada.</p>
            </div>
          )}

          <div className="p-10 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Sincronizado com o banco de dados</p>
            <button className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:underline">
              <Download className="size-4" />
              Exportar Relatório
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
