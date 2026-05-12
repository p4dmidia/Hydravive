import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Layers,
  ShoppingBag,
  ExternalLink,
  FolderTree
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Afiliados', path: '/admin/affiliates' },
    { icon: Package, label: 'Produtos', path: '/admin/products' },
    { icon: FolderTree, label: 'Categorias', path: '/admin/categories' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/admin/orders' },
    { icon: Layers, label: 'Configurações MMN', path: '/admin/mmn/levels' },
    { icon: Wallet, label: 'Saques', path: '/admin/withdrawals' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
    { icon: ShoppingBag, label: 'Visitar Loja', path: '/shop', external: true },
  ];

  const handleLogout = async () => {
    try {
      // Limpeza agressiva de sessão
      supabase.auth.signOut().catch(() => {});
      localStorage.clear();
      sessionStorage.clear();
      
      // Limpar cookies do Supabase se existirem
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }

      window.location.href = '/admin/login';
    } catch (error) {
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-300">
      {/* Sidebar */}
      <aside className={`bg-[#1E293B] border-r border-white/5 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-4 mb-8">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="size-6 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-white font-black uppercase tracking-tight">Hydravive</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin Center</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                target={item.external ? "_blank" : undefined}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon className={`size-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary transition-colors'}`} />
                {isSidebarOpen && <span className="text-sm font-bold">{item.label}</span>}
                {isSidebarOpen && isActive && <ChevronRight className="ml-auto size-4" />}
                {isSidebarOpen && item.external && <ExternalLink className="ml-auto size-3 text-slate-600" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold group"
          >
            <LogOut className="size-5 group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-sm">Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-white/5 bg-[#1E293B]/50 backdrop-blur-xl flex items-center justify-between px-8">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">Administrador</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Control</p>
            </div>
            <div className="size-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white font-black">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
