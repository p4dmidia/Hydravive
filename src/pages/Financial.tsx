import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  TrendingUp,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface Transaction {
  id: string;
  type: 'commission' | 'withdrawal';
  amount: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  description: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'commission', amount: 'R$ 145,50', status: 'approved', date: 'Hoje, 14:20', description: 'Venda HydraFlow #9421' },
  { id: '2', type: 'withdrawal', amount: 'R$ 2.500,00', status: 'pending', date: 'Ontem, 09:12', description: 'Saque via PIX' },
  { id: '3', type: 'commission', amount: 'R$ 82,00', status: 'approved', date: '18 Mar, 2024', description: 'Comissão Nível 2 - Ana C.' },
  { id: '4', type: 'commission', amount: 'R$ 421,00', status: 'approved', date: '15 Mar, 2024', description: 'Venda Combo 5x #9102' },
  { id: '5', type: 'withdrawal', amount: 'R$ 1.200,00', status: 'approved', date: '10 Mar, 2024', description: 'Saque via PIX' },
  { id: '6', type: 'commission', amount: 'R$ 12,00', status: 'rejected', date: '05 Mar, 2024', description: 'Venda Cancelada #8231' },
];

export default function FinancialPage() {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'ganhos' | 'saques'>('todos');

  return (
    <DashboardLayout>
      <div className="p-4 md:p-10 max-w-[1400px] mx-auto space-y-8 md:space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-[#111618] text-2xl md:text-4xl font-black tracking-tighter mb-1 uppercase">Gestão Financeira</h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium font-semibold">Acompanhe seus rendimentos e gerencie seus saques.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/30 transition-all active:scale-95">
              <Plus className="size-5" />
              <span>Solicitar Novo Saque</span>
            </button>
          </div>
        </div>

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
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-1 font-black">R$ 12.450,00</h3>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  +12% vs mês anterior
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
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">R$ 5.200,00</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6">Próxima liberação: 25/03/2024</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-10 md:size-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <CheckCircle2 className="size-5 md:size-6 text-slate-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Sacado</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">R$ 48.912,00</h3>
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
                {MOCK_TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${tx.type === 'commission' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                        {tx.type === 'commission' ? <ArrowDownLeft className="size-5" /> : <ArrowUpRight className="size-5" />}
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-slate-700 text-sm">{tx.description}</td>
                    <td className="px-6 py-6 text-slate-400 font-medium text-xs">{tx.date}</td>
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
                      {tx.type === 'commission' ? `+ ${tx.amount}` : `- ${tx.amount}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-10 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium font-medium">Mostrando as últimas 10 transações</p>
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
