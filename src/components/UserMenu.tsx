
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  LayoutDashboard, 
  Package, 
  LogOut, 
  ChevronDown,
  UserCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link 
        to="/login" 
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-slate-900/10 active:scale-95"
      >
        <User className="size-4" />
        <span className="hidden sm:inline">Entrar</span>
      </Link>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      toast.success('Até logo!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao sair');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'affiliate': return 'Afiliado Pro';
      default: return 'Cliente';
    }
  };

  const getDashboardPath = () => {
    if (profile?.role === 'admin') return '/admin/dashboard';
    if (profile?.role === 'affiliate') return '/dashboard';
    return null;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
      >
        <div className="size-8 md:size-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-sm font-black overflow-hidden">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
          ) : (
            <span>{profile?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-[10px] font-black text-slate-900 leading-tight truncate max-w-[100px]">
            {profile?.full_name?.split(' ')[0] || 'Usuário'}
          </p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            {getRoleLabel(profile?.role || 'client')}
          </p>
        </div>
        <ChevronDown className={`size-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-[2rem] shadow-2xl transition-all duration-300 origin-top-right z-[100] p-3 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="flex flex-col gap-1">
          {/* Header do Menu (Mobile) */}
          <div className="md:hidden px-4 py-4 border-b border-slate-50 mb-1">
             <p className="text-sm font-black text-slate-900">{profile?.full_name}</p>
             <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{getRoleLabel(profile?.role || 'client')}</p>
          </div>

          {getDashboardPath() && (
            <Link 
              to={getDashboardPath()!}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all group"
            >
              <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <LayoutDashboard className="size-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Meu Painel</span>
            </Link>
          )}

          <Link 
            to="/my-orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all group"
          >
            <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Package className="size-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Meus Pedidos</span>
          </Link>

          <Link 
            to="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all group"
          >
            <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <UserCircle className="size-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Meu Perfil</span>
          </Link>

          <div className="h-px bg-slate-100 my-1 mx-4" />

          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all group w-full text-left"
          >
            <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut className="size-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Sair da Conta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
