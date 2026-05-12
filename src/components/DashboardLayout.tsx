import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  Bell, 
  MessageSquare, 
  LogOut,
  Target,
  Wallet,
  TrendingUp,
  Search,
  Menu,
  X,
  Award,
  ShoppingCart
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Início', path: '/dashboard' },
    { icon: Target, label: 'Minha Rede', path: '/dashboard/network' },
    { icon: ImageIcon, label: 'Marketing', path: '/dashboard/marketing' },
    { icon: Wallet, label: 'Financeiro', path: '/dashboard/financial' },
  ];

  const handleLogout = async () => {
    try {
      // Tenta deslogar no Supabase, mas com um limite de tempo
      await Promise.race([
        signOut(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500))
      ]);
    } catch (err) {
      console.warn('Logout forçado devido a lentidão');
    } finally {
      // Limpa dados locais e força recarga da página no login
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Mobile Menu Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-[100] shrink-0 transform transition-transform duration-500 lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logo.png" alt="Hydravive" className="h-12 w-auto" />
            </div>
            <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-primary">
              <X className="size-6" />
            </button>
          </div>
          
          <div className="flex flex-col gap-8 flex-1">
            <nav className="flex flex-col gap-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-3">Menu Principal</p>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.label}
                    to={item.path} 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <item.icon className="size-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <nav className="flex flex-col gap-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-3">Suporte & Conta</p>
              <Link 
                to="/dashboard/profile" 
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold group ${location.pathname === '/dashboard/profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Settings className={`size-5 transition-colors ${location.pathname === '/dashboard/profile' ? 'text-white' : 'group-hover:text-primary'}`} />
                <span className="text-sm">Perfil</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold group w-full text-left"
              >
                <LogOut className="size-5" />
                <span className="text-sm">Sair do Escritório</span>
              </button>
            </nav>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="relative z-10 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Plano Atual</p>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">
                  {profile?.role === 'admin' ? 'Administrador' : (profile?.role === 'affiliate' ? 'Afiliado Pro' : 'Afiliado Starter')}
                </h4>
                <button 
                  onClick={() => window.location.href = '/dashboard?tab=ranking'}
                  className="w-full py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95"
                >
                  Ver Ranking
                </button>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Award className="size-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 lg:px-10 py-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center rounded-xl size-10 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            >
              <Menu className="size-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg lg:text-xl font-black text-slate-900 uppercase tracking-tight">Escritório Virtual</h1>
              <p className="text-[10px] lg:text-xs text-slate-500 font-medium hidden sm:block">Hydravive &copy; Todos os direitos reservados.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden md:flex w-64 items-center rounded-xl bg-slate-50 border border-slate-200 shadow-sm px-4 h-10 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input className="flex-1 border-none bg-transparent focus:ring-0 px-3 text-sm font-medium placeholder:text-slate-400" placeholder="Buscar..." />
            </div>
            
            <UserMenu />

            <div className="flex items-center gap-1 lg:gap-2">
              <button className="flex items-center justify-center rounded-xl size-9 lg:size-10 bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 transition-all">
                <Bell className="size-4 lg:size-5" />
              </button>
              <button className="hidden sm:flex items-center justify-center rounded-xl size-10 bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 transition-all">
                <MessageSquare className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-84px)] px-4 lg:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}
