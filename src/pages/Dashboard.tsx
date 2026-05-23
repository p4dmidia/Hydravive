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
  Image as ImageIcon,
  Coins,
  Trophy,
  Target,
  ShoppingCart,
  Loader2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<any>(null);
  const [salesCount, setSalesCount] = React.useState(0);
  const [avgCommission, setAvgCommission] = React.useState(0);
  const [ranking, setRanking] = React.useState<any[]>([]);
  const [activationStatus, setActivationStatus] = React.useState<any>(null);

  React.useEffect(() => {
    const targetId = profile?.id || user?.id;
    
    if (!targetId) {
      if (!authLoading) setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      const authId = user?.id;
      if (!authId) return;

      // 1. Tentar carregar do Cache para ser INSTANTÂNEO
      const cacheKey = `dash_v2_${authId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const p = JSON.parse(cached);
        setStats(p.stats);
        setSalesCount(p.salesCount);
        setRanking(p.ranking);
        setAvgCommission(p.avg);
        if (p.activationStatus) setActivationStatus(p.activationStatus);
        setLoading(false); // Libera a tela na hora com o cache
      }

      // Fail-safe de 7 segundos
      const timeoutId = setTimeout(() => setLoading(false), 7000);

      try {
        console.log('Dashboard: Atualizando dados em background...');
        
        // Buscar o ID numérico
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('mocha_user_id', authId)
          .single();

        if (profileData) {
          const numericId = profileData.id;
          const [statsRes, rankingRes, gradsRes, activationRes] = await Promise.all([
            supabase.from('affiliate_stats')
              .select('*, graduations(*)')
              .eq('user_id', numericId)
              .maybeSingle(),
            supabase.from('affiliate_stats')
              .select('monthly_points, user_profiles(full_name, avatar_url)')
              .order('monthly_points', { ascending: false })
              .limit(20),
            supabase.from('graduations')
              .select('*')
              .order('level_order', { ascending: true }),
            supabase.from('affiliate_activation_status')
              .select('*')
              .eq('user_id', numericId)
              .maybeSingle()
          ]);

          let actStatus = { is_active_this_month: false, has_sale: false, has_referral: false };
          if (activationRes && !activationRes.error && activationRes.data) {
            actStatus = activationRes.data;
          }
          setActivationStatus(actStatus);

          if (statsRes.data) {
            const s = statsRes.data;
            const grads = gradsRes.data || [];
            const currentGrad = s.graduations;
            const nextGrad = grads.find((g: any) => g.level_order > (currentGrad?.level_order || 0));
            
            const avg = s.total_sales > 0 ? (s.total_earnings / s.total_sales) : 0;
            
            setStats({
              ...s,
              current_graduation: currentGrad,
              next_graduation: nextGrad
            });
            setSalesCount(s.total_sales || 0);
            setAvgCommission(avg);
            
            // Salvar no Cache
            localStorage.setItem(cacheKey, JSON.stringify({
              stats: {
                ...s,
                current_graduation: currentGrad,
                next_graduation: nextGrad
              },
              salesCount: s.total_sales || 0,
              ranking: rankingRes.data || [],
              avg: avg,
              activationStatus: actStatus
            }));
          }
          if (rankingRes.data) setRanking(rankingRes.data);
        }
      } catch (error) {
        console.error('Dashboard Sync Error:', error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchDashboardData();

        // Configurar Realtime para atualizações automáticas
        const statsChannel = supabase
          .channel('dashboard-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'affiliate_stats',
              filter: `user_id=eq.${targetId}`
            },
            () => {
              console.log('Stats updated in realtime, refreshing dashboard...');
              fetchDashboardData();
            }
          )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'affiliate_stats'
        },
        (payload) => {
          // Se qualquer um mudar, atualiza o ranking
          console.log('Ranking changed, refreshing...');
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statsChannel);
    };
  }, [user?.id, profile?.id, authLoading]);

  const [isRankingModalOpen, setIsRankingModalOpen] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'ranking') {
      setIsRankingModalOpen(true);
    }
  }, [window.location.search]);

  const monthlyPoints = stats?.monthly_points || 0;
  const targetPoints = 5000;
  const progressPercent = Math.min((monthlyPoints / targetPoints) * 100, 100);

  console.log('Dashboard Stats:', { monthlyPoints, stats });

  // Se a auth terminou e NÃO temos usuário, é erro ou precisa logar
  if (!authLoading && !user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
          <div className="bg-red-50 p-6 rounded-full mb-6">
            <Users className="size-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Sessão expirada</h2>
          <p className="text-slate-500 max-w-md mb-8">
            Não conseguimos recuperar sua sessão. Por favor, faça login novamente.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Ir para Login
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Removido o bloqueio de "Carregando dados da conta". 
  // Agora a tela abre IMEDIATAMENTE e os dados aparecem conforme chegam.

  return (
    <DashboardLayout>
      <div className="p-10 max-w-[1400px] mx-auto space-y-10">
        {/* Modal de Ranking */}
        {isRankingModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => {
                setIsRankingModalOpen(false);
                navigate('/dashboard', { replace: true });
              }}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Trophy className="size-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ranking Global</h3>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Os Melhores do Mês</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsRankingModalOpen(false);
                    navigate('/dashboard', { replace: true });
                  }}
                  className="size-12 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center"
                >
                  <X className="size-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="space-y-4">
                  {ranking.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-6 p-6 rounded-[2rem] transition-all border ${
                        item?.user_profiles?.full_name === profile?.full_name 
                          ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' 
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className={`size-10 rounded-xl flex items-center justify-center font-black text-sm ${
                        index === 0 ? 'bg-amber-100 text-amber-600' : 
                        index === 1 ? 'bg-slate-100 text-slate-600' : 
                        index === 2 ? 'bg-amber-50 text-amber-800' : 'bg-slate-50 text-slate-400'
                      }`}>
                        #{index + 1}
                      </div>
                      
                      <img 
                        src={item?.user_profiles?.avatar_url || `https://ui-avatars.com/api/?name=${item?.user_profiles?.full_name || 'User'}&background=random`} 
                        className="size-14 rounded-2xl border-2 border-white shadow-sm" 
                        alt="" 
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-900">{item?.user_profiles?.full_name || 'Usuário'}</p>
                          {item?.user_profiles?.full_name === profile?.full_name && (
                            <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full">Você</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Membro Ativo</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">{(item?.monthly_points || 0).toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pontos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-8 bg-slate-900 text-white text-center">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">O ranking é atualizado em tempo real</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-[#111618] text-5xl font-black tracking-tighter leading-none">Olá, {profile?.full_name?.split(' ')[0] || 'Afiliado'}!</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-slate-500 text-lg font-medium">Seja bem-vindo ao seu painel de controle de afiliado.</p>
              <button 
                onClick={() => navigate('/shop')}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <ShoppingCart className="size-4" />
                Comprar com Desconto
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-white border border-slate-200 rounded-3xl px-6 py-4 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Qualificação</span>
              <span className={`text-sm font-black uppercase tracking-widest text-primary`}>
                {stats?.current_graduation?.name || 'Afiliado'}
              </span>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl px-6 py-4 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pontos do Mês</span>
              <span className="text-sm font-black text-amber-500 uppercase tracking-widest">{monthlyPoints} PTS</span>
            </div>
          </div>
        </div>

        {/* Banner de Ativação Mensal */}
        {activationStatus && (
          <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden ${
            activationStatus.is_active_this_month 
              ? 'bg-emerald-500/[0.03] border-emerald-500/20 shadow-xl shadow-emerald-500/5' 
              : 'bg-amber-500/[0.03] border-amber-500/20 shadow-xl shadow-amber-500/5'
          }`}>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  activationStatus.is_active_this_month 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-amber-500 text-white shadow-amber-500/20'
                }`}>
                  {activationStatus.is_active_this_month ? (
                    <Trophy className="size-7" />
                  ) : (
                    <Target className="size-7 animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className={`text-xl font-black uppercase tracking-tight ${
                    activationStatus.is_active_this_month ? 'text-emerald-600 font-extrabold' : 'text-amber-600 font-extrabold'
                  }`}>
                    {activationStatus.is_active_this_month 
                      ? 'Sua Conta está Ativada! 🎉' 
                      : 'Ativação Mensal Pendente ⚠️'
                    }
                  </h3>
                  <p className="text-sm mt-1 font-medium leading-relaxed max-w-2xl text-slate-500">
                    {activationStatus.is_active_this_month 
                      ? `Parabéns! Você já realizou as metas deste mês e está elegível para receber todas as comissões de rede de 10 níveis.` 
                      : 'Para desbloquear o recebimento de comissões de rede este mês, você precisa realizar pelo menos 1 venda direta ou indicar/recrutar 1 novo afiliado.'
                    }
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex flex-wrap gap-3">
                <div className={`px-4 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                  activationStatus.has_sale 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <DollarSign className="size-4" /> Venda Mensal: {activationStatus.has_sale ? 'OK' : 'Pendente'}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                  activationStatus.has_referral 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <Users className="size-4" /> Indicação Mensal: {activationStatus.has_referral ? 'OK' : 'Pendente'}
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className={`absolute -bottom-10 -right-10 opacity-5 pointer-events-none ${
              activationStatus.is_active_this_month ? 'text-emerald-500' : 'text-amber-500'
            }`}>
              {activationStatus.is_active_this_month ? (
                <Trophy className="size-48" />
              ) : (
                <Target className="size-48" />
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: 'Saldo Disponível', 
              value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.available_balance || 0), 
              trend: `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.frozen_balance || 0)} a liberar`, 
              sub: 'Previsão p/ dia 25', 
              icon: Wallet, 
              color: 'text-emerald-500', 
              bg: 'bg-emerald-50' 
            },
            { 
              label: 'Meus Pontos', 
              value: `${stats?.points_balance || 0} PTS`, 
              trend: 'Resgate disponível', 
              sub: 'Troque por produtos', 
              icon: Coins, 
              color: 'text-amber-500', 
              bg: 'bg-amber-50' 
            },
            { 
              label: 'Vendas Diretas', 
              value: salesCount.toString(), 
              trend: '+0 esta semana', 
              sub: 'Acompanhe seu progresso', 
              icon: DollarSign, 
              color: 'text-primary', 
              bg: 'bg-primary/10' 
            },
            { 
              label: 'Comissão Média', 
              value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(avgCommission), 
              trend: 'Por venda', 
              sub: 'Média de ganhos', 
              icon: BarChart3, 
              color: 'text-purple-500', 
              bg: 'bg-purple-50' 
            },
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
            {/* Points Progress */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-amber-500 flex items-center justify-center">
                      <Trophy className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Status de Qualificação</h3>
                      <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                        Nível Atual: {stats?.current_graduation?.name || 'Afiliado'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-500">{monthlyPoints.toLocaleString()}</span>
                    <span className="text-white/30 font-black text-xl"> / {(stats?.next_graduation?.points_target || 10000).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min((monthlyPoints / (stats?.next_graduation?.points_target || 10000)) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                    <span>{stats?.current_graduation?.name || 'Início'}</span>
                    <span>{Math.min(Math.round((monthlyPoints / (stats?.next_graduation?.points_target || 10000)) * 100), 100)}% para o próximo nível</span>
                    <span>{stats?.next_graduation?.name || 'Meta Final'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-black text-white/40 uppercase mb-1">Próxima Recompensa</p>
                    <p className="text-sm font-bold">{stats?.next_graduation?.reward || 'Consultar Admin'}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-black text-white/40 uppercase mb-1">Faltam</p>
                    <p className="text-sm font-bold text-amber-500">{Math.max(0, (stats?.next_graduation?.points_target || 10000) - monthlyPoints).toLocaleString()} PTS</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5">
                <Trophy className="size-64" />
              </div>
            </div>

            {/* Links de Afiliado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Link de Vendas (Loja) */}
              <div className="flex flex-col gap-6 rounded-[2.5rem] border-2 border-primary/20 bg-white p-8 shadow-xl shadow-primary/5 relative overflow-hidden group">
                <div className="flex flex-col gap-2 relative z-10">
                  <h3 className="text-[#111618] text-xl font-black uppercase tracking-tighter">Link de Vendas (Loja)</h3>
                  <p className="text-slate-500 text-sm font-medium">Mande direto para o site oficial.</p>
                </div>
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-200 px-6 h-14 shadow-inner overflow-hidden">
                    <span className="text-primary text-[11px] font-black truncate tracking-tight">{window.location.origin}/?ref={stats?.referral_code || profile?.referral_code || '...'}</span>
                  </div>
                  <button 
                    onClick={() => {
                      const code = stats?.referral_code || profile?.referral_code;
                      if (code) {
                        navigator.clipboard.writeText(`${window.location.origin}/?ref=${code}`);
                        toast.success('Link de vendas copiado!');
                      }
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl h-14 px-6 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/30"
                  >
                    <Copy className="size-4" />
                    <span>Copiar Link</span>
                  </button>
                </div>
                <div className="absolute top-0 right-0 p-6 text-primary/5 group-hover:text-primary/10 transition-colors">
                  <LinkIcon className="size-24 rotate-12" />
                </div>
              </div>

              {/* Link de Cadastro (Recrutamento) */}
              <div className="flex flex-col gap-6 rounded-[2.5rem] border-2 border-emerald-500/20 bg-white p-8 shadow-xl shadow-emerald-500/5 relative overflow-hidden group">
                <div className="flex flex-col gap-2 relative z-10">
                  <h3 className="text-[#111618] text-xl font-black uppercase tracking-tighter">Link de Cadastro (Rede)</h3>
                  <p className="text-slate-500 text-sm font-medium">Mande direto para a tela de cadastro.</p>
                </div>
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-200 px-6 h-14 shadow-inner overflow-hidden">
                    <span className="text-emerald-500 text-[11px] font-black truncate tracking-tight">{window.location.origin}/register?ref={stats?.referral_code || profile?.referral_code || '...'}</span>
                  </div>
                  <button 
                    onClick={() => {
                      const code = stats?.referral_code || profile?.referral_code;
                      if (code) {
                        navigator.clipboard.writeText(`${window.location.origin}/register?ref=${code}`);
                        toast.success('Link de cadastro copiado!');
                      }
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl h-14 px-6 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
                  >
                    <Copy className="size-4" />
                    <span>Copiar Link</span>
                  </button>
                </div>
                <div className="absolute top-0 right-0 p-6 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors">
                  <Users className="size-24 rotate-12" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Ranking Card */}
            <div className="rounded-[2.5rem] bg-white border border-slate-200 p-10 shadow-sm flex flex-col h-fit">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Trophy className="size-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-slate-900 leading-none">Ranking Mensal</h3>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Março 2024</span>
              </div>

              <div className="space-y-5">
                {ranking.slice(0, 4).map((item, index) => (
                  <div key={index} className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${item?.user_profiles?.full_name === profile?.full_name ? 'bg-primary/5 border border-primary/20' : ''}`}>
                    <div className="w-6 text-center font-black text-slate-400 text-xs">
                      #{index + 1}
                    </div>
                    <img 
                      src={item?.user_profiles?.avatar_url || `https://ui-avatars.com/api/?name=${item?.user_profiles?.full_name || 'User'}&background=random`} 
                      className="size-10 rounded-full border border-slate-200" 
                      alt="" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item?.user_profiles?.full_name || 'Usuário'}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{(item?.monthly_points || 0).toLocaleString()} PTS</p>
                    </div>
                    {index <= 2 && (
                      <Trophy className={`size-4 ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : 'text-amber-700'}`} />
                    )}
                  </div>
                ))}
                {ranking.length === 0 && (
                  <p className="text-center text-slate-400 text-xs py-4 italic">Nenhum dado de ranking disponível</p>
                )}
              </div>

              <button 
                onClick={() => setIsRankingModalOpen(true)}
                className="w-full mt-8 py-4 rounded-2xl bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                Ver Ranking Completo
              </button>
            </div>

            {/* Training Card */}
            <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white flex flex-col gap-6 group cursor-pointer hover:bg-slate-800 transition-all border border-white/5">
              <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <BookOpen className="size-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2 uppercase tracking-tight">Academia Hydravive</h4>
                <p className="text-white/60 text-sm leading-relaxed">Aprenda a escalar seus ganhos e subir no ranking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
