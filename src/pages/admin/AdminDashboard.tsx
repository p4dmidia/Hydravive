import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAffiliates: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingWithdrawals: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      if (!mounted) return;
      setLoading(true);
      
      try {
        // Consultas isoladas com Promise.allSettled
        const results = await Promise.allSettled([
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('total_amount, status'),
          supabase.from('withdrawals').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ]);

        if (!mounted) return;

        const newStats = { ...stats };

        // Processar Afiliados
        if (results[0].status === 'fulfilled' && !results[0].value.error) {
          newStats.totalAffiliates = results[0].value.count || 0;
        }

        // Processar Produtos
        if (results[1].status === 'fulfilled' && !results[1].value.error) {
          newStats.totalProducts = results[1].value.count || 0;
        }

        // Processar Pedidos e Receita
        if (results[2].status === 'fulfilled' && !results[2].value.error) {
          const orders = results[2].value.data || [];
          newStats.totalOrders = orders.length;
          newStats.totalRevenue = orders
            .filter(o => o.status === 'paid' || o.status === 'delivered')
            .reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
        }

        // Processar Saques
        if (results[3].status === 'fulfilled' && !results[3].value.error) {
          newStats.pendingWithdrawals = results[3].value.count || 0;
        }

        setStats(newStats);
      } catch (err) {
        console.error('Erro ao carregar Dashboard:', err);
        setError('Ocorreu um problema ao carregar alguns dados.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();

    return () => { mounted = false; };
  }, []);

  const statCards = [
    { label: 'Afiliados', value: stats.totalAffiliates, icon: Users, color: 'bg-blue-500' },
    { label: 'Produtos', value: stats.totalProducts, icon: Package, color: 'bg-primary' },
    { label: 'Pedidos', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-emerald-500' },
    { label: 'Saques Pendentes', value: stats.pendingWithdrawals, icon: Wallet, color: 'bg-amber-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Visão Geral</h2>
            <p className="text-slate-500 mt-1">Dados reais do sistema Hydravive.</p>
          </div>
          <div className="bg-[#1E293B] border border-white/5 rounded-2xl px-6 py-3 flex items-center gap-3">
            <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Sincronizado</span>
          </div>
        </div>

        {error && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3 text-amber-500 text-sm font-bold uppercase tracking-tight">
            <AlertCircle className="size-5" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Consultando base de dados...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => (
              <div key={card.label} className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-8 group hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`size-12 rounded-2xl ${card.color}/20 flex items-center justify-center`}>
                    <card.icon className="size-6 text-white" />
                  </div>
                  <ArrowUpRight className="size-4 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-3xl font-black text-white">{card.value}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Receita Grande */}
        {!loading && (
          <div className="bg-[#1E293B] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Faturamento Bruto</h3>
              <p className="text-5xl font-black text-white tracking-tighter">
                R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-2 mt-6">
                <div className="px-4 py-2 bg-emerald-500/10 rounded-xl flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-500" />
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Baseado em pedidos pagos</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
