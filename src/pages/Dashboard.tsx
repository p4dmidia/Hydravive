import React from 'react';
import { 
  DollarSign, 
  Users, 
  BarChart3, 
  Link as LinkIcon, 
  Copy, 
  TrendingUp,
  BookOpen,
  ArrowRight,
  Wallet,
  Image as ImageIcon
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-10 max-w-[1400px] mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-[#111618] text-5xl font-black tracking-tighter leading-none">Olá, Bruno!</h2>
            <p className="text-slate-500 text-lg font-medium">Seja bem-vindo ao seu painel de controle de embaixador.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white border border-slate-200 rounded-3xl px-6 py-4 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</span>
              <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">Ativo</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl px-6 py-4 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ID</span>
              <span className="text-sm font-black text-slate-900 uppercase tracking-widest">#8420</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Saldo Disponível', value: 'R$ 12.450,00', trend: 'R$ 5.200 a liberar', sub: 'Previsão p/ dia 25', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Vendas Diretas', value: '24', trend: '+4 esta semana', sub: 'vs. 18 semana anterior', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Leads Ativos', value: '142', trend: '+12 hoje', sub: 'Interessados no site', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Comissão Média', value: 'R$ 152,00', trend: '+5,2%', sub: 'Por venda realizada', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((stat) => (
            <div key={stat.label} className="group relative flex flex-col gap-4 rounded-[2rem] p-8 bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="size-6" />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-[#111618] text-2xl font-black">{stat.value}</p>
              </div>
              <div className="flex flex-col gap-1 border-t border-slate-50 pt-3">
                <p className={`${stat.color} text-xs font-black uppercase tracking-widest`}>{stat.trend}</p>
                <p className="text-slate-500 text-[10px] font-medium">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Affiliate Link */}
            <div className="flex flex-col gap-6 rounded-[2.5rem] border-2 border-primary/20 bg-white p-10 shadow-xl shadow-primary/5 relative overflow-hidden group">
              <div className="flex flex-col gap-2 relative z-10">
                <h3 className="text-[#111618] text-2xl font-black uppercase tracking-tighter">Seu Link de Vendas</h3>
                <p className="text-slate-500 font-medium">Compartilhe este link em suas redes sociais e ganhe comissão por cada venda!</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <div className="flex-1 flex items-center bg-slate-50 rounded-2xl border border-slate-200 px-6 h-16 shadow-inner">
                  <span className="text-primary text-sm font-black truncate tracking-tight">https://hydravive-loja.com/ref/brunoms_2024</span>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-2xl h-16 px-8 bg-primary text-white text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/30">
                  <Copy className="size-5" />
                  <span>Copiar Link</span>
                </button>
              </div>
              <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-colors">
                <LinkIcon className="size-32 rotate-12" />
              </div>
            </div>

            {/* Training Cards */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">Próximos Passos</h3>
                <button className="text-sm font-extrabold text-primary flex items-center gap-1 group">
                  Ver Academia <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-[2rem] bg-slate-900 p-8 text-white flex flex-col gap-6 group cursor-pointer hover:bg-slate-800 transition-all border border-white/5">
                  <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <BookOpen className="size-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Guia do Iniciante</h4>
                    <p className="text-white/60 text-sm leading-relaxed">Aprenda as melhores estratégias para vender os sistemas Hydra.</p>
                  </div>
                </div>
                <div className="rounded-[2rem] bg-white p-8 border border-slate-200 flex flex-col gap-6 group cursor-pointer hover:border-primary/50 transition-all shadow-sm">
                  <div className="size-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <ImageIcon className="size-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Kit de Criativos</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Imagens e vídeos prontos para você postar nos stories e feed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Activity Card */}
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-900 leading-none">Últimas Vendas</h3>
                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center">
                  <DollarSign className="size-5 text-slate-400" />
                </div>
              </div>
              <div className="space-y-6 flex-1">
                {[
                  { name: 'Ricardo Dias', time: 'Há 15 min', amount: '+R$ 145,50', status: 'Processando' },
                  { name: 'Amanda Oliveira', time: 'Há 2 horas', amount: '+R$ 421,00', status: 'Aprovado' },
                  { name: 'Lucas Pereira', time: 'Há 5 horas', amount: '+R$ 38,20', status: 'Aprovado' },
                  { name: 'Carla Santos', time: 'Ontem', amount: '+R$ 12,00', status: 'Aprovado' },
                ].map((sale, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                      {sale.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{sale.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{sale.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-500">{sale.amount}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{sale.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 rounded-2xl bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                Extrato Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
