import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  RefreshCw, 
  MessageSquare, 
  LogOut, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function PendingApproval() {
  const { profile, signOut, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [sponsorName, setSponsorName] = useState<string>('Buscando...');

  useEffect(() => {
    // Se o usuário de repente for ativado, manda para o dashboard
    if (profile && profile.is_active) {
      navigate('/dashboard', { replace: true });
    }

    // Buscar nome do patrocinador
    if (profile?.sponsor_id) {
      fetchSponsorName(profile.sponsor_id);
    } else {
      setSponsorName('Nenhum (Indicação Direta)');
    }
  }, [profile]);

  const fetchSponsorName = async (sponsorId: number) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', sponsorId)
        .single();
      
      if (data) {
        setSponsorName(data.full_name || 'N/A');
      } else {
        setSponsorName('N/A');
      }
    } catch (e) {
      setSponsorName('N/A');
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      await fetchProfile();
      toast.success('Status atualizado!');
    } catch (e) {
      toast.error('Erro ao verificar status.');
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
      toast.success('Sessão encerrada.');
    } catch (e) {
      toast.error('Erro ao sair.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative z-10">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-125 animate-pulse"></div>
            <div className="size-20 bg-gradient-to-tr from-primary to-blue-500 rounded-3xl flex items-center justify-center text-white shadow-xl relative z-10">
              <Clock className="size-10 animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-none">
            Cadastro <br /><span className="text-primary">Recebido!</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base max-w-md mx-auto">
            Sua conta de afiliado foi registrada com sucesso, e está aguardando a liberação do administrador.
          </p>
        </div>

        {/* Details Box */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4 mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
            <ShieldAlert className="size-3.5" /> Dados do Cadastro
          </h2>
          
          <div className="grid grid-cols-1 gap-3 text-xs md:text-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500 font-medium">Nome Completo:</span>
              <span className="font-bold text-white uppercase">{profile?.full_name || 'Carregando...'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500 font-medium">E-mail:</span>
              <span className="font-bold text-slate-300">{profile?.email || 'Carregando...'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500 font-medium">WhatsApp:</span>
              <span className="font-bold text-slate-300">{profile?.phone || 'Não informado'}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Indicado por:</span>
              <span className="font-bold text-emerald-400 uppercase">{sponsorName}</span>
            </div>
          </div>
        </div>

        {/* Informational Warning */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-8 flex gap-4 items-start">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-400">Pré-requisito de Compra</p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              O administrador confirmará se você adquiriu o produto de afiliação correspondente. Assim que o pagamento for verificado, sua conta será aprovada automaticamente.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full bg-primary hover:brightness-110 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${checking ? 'animate-spin' : ''}`} />
            {checking ? 'Verificando...' : 'Verificar Status de Aprovação'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <a
              href="https://wa.me/556296390724"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/10"
            >
              <MessageSquare className="size-3.5" /> Falar com Suporte
            </a>
            
            <button
              onClick={handleSignOut}
              className="bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all border border-white/5"
            >
              <LogOut className="size-3.5" /> Sair da Conta
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
