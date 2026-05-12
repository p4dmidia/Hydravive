import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('--- DIAGNÓSTICO DE LOGIN ---');
      console.log('Status do Erro:', error?.status);
      console.log('Mensagem do Erro:', error?.message);
      if (error) {
        console.dir(error);
        // Tenta capturar o erro do banco de dados se vier no corpo
        if (error.status === 500) {
          console.error('ERRO 500 DETECTADO: Verifique se existem gatilhos (triggers) falhando no Supabase Dashboard.');
        }
        throw error;
      }

      console.log('Sucesso no login Auth, verificando perfil...');

      if (data.user) {
        // Verificar se o usuário realmente tem permissão de admin
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('mocha_user_id', data.user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Acesso negado. Apenas administradores podem acessar esta área.');
        }

        toast.success('Bem-vindo ao painel de controle!');
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col items-center gap-6 mb-10">
            <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
              <ShieldCheck className="size-10 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black text-white tracking-tight uppercase">Admin Center</h1>
              <p className="text-slate-400 text-sm mt-2">Área restrita para gestão estratégica Hydravive</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Administrativo</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hydravive.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Acessar Sistema'
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-[0.2em]">
              Hydravive Security &copy; 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
