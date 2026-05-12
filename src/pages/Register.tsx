import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  Users,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingSponsor, setFetchingSponsor] = useState(false);
  const [sponsorName, setSponsorName] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    cpfCnpj: '',
    pixKey: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });

  // Carregar código de indicação
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRef = urlParams.get('ref');
    const savedRef = localStorage.getItem('hydravive_ref');
    
    const finalRef = urlRef || savedRef;
    
    if (finalRef) {
      setFormData(prev => ({ ...prev, referralCode: finalRef }));
      fetchSponsor(finalRef);
      // Salva no localStorage para persistência se veio da URL
      if (urlRef) localStorage.setItem('hydravive_ref', urlRef);
    }
  }, []);

  const fetchSponsor = async (code: string) => {
    if (!code) {
      setSponsorName(null);
      return;
    }
    setFetchingSponsor(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name')
        .ilike('referral_code', code)
        .single();

      if (data) {
        setSponsorName(data.full_name);
      } else {
        setSponsorName(null);
      }
    } catch (error) {
      setSponsorName(null);
    } finally {
      setFetchingSponsor(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('As senhas não coincidem');
    }

    setLoading(true);
    console.log('Iniciando cadastro para:', formData.email);
    try {
      // 1. Verificar se o e-mail já existe no banco
      console.log('Verificando e-mail existente...');
      const { data: existingUser, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (checkError) {
        console.error('Erro na verificação de e-mail:', checkError);
      }

      if (existingUser) {
        throw new Error('Este e-mail já está cadastrado.');
      }

      // 2. Sign up user com Metadados
      console.log('Chamando supabase.auth.signUp com metadados...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            whatsapp: formData.whatsapp,
            cpfCnpj: formData.cpfCnpj,
            pixKey: formData.pixKey,
            sponsor_code: formData.referralCode, // Envia o código de quem indicou
            login: formData.firstName.toLowerCase() + Math.floor(Math.random() * 1000)
          }
        }
      });

      console.log('Resultado do signUp:', { authData, authError });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Falha ao criar usuário');

      // IMPORTANTE: Não precisamos mais fazer o INSERT manual aqui!
      // O Trigger SQL que instalamos cuidará de criar o perfil, vincular o patrocinador
      // e gerar o saldo inicial automaticamente.

      console.log('Cadastro concluído com sucesso (via Trigger)!');
      toast.success('Cadastro realizado com sucesso! Verifique seu e-mail se necessário.');
      
      // Pequeno delay para garantir que o trigger terminou de processar antes de redirecionar
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
      // Limpar referência após cadastro
      localStorage.removeItem('hydravive_ref');
      
    } catch (error: any) {
      console.error('Erro capturado no catch:', error);
      toast.error(error.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
      console.log('Fim do processo de cadastro.');
    }

  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 pt-24 pb-12">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Info Col */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">
              Pronto para <br /><span className="text-primary">começar?</span>
            </h1>
            <p className="text-slate-500 font-medium">Sua aprovação é imediata! Comece a lucrar agora mesmo.</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: CheckCircle2, text: 'Aprovação imediata e automática', color: 'text-primary' },
              { icon: CheckCircle2, text: 'Acesso instantâneo ao treinamento', color: 'text-primary' },
              { icon: CheckCircle2, text: 'Onboarding individual', color: 'text-primary' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <item.icon className={`size-5 ${item.color}`} />
                <span className="text-sm font-bold text-slate-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Col */}
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primeiro Nome</label>
                <input required type="text" placeholder="Bruno" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sobrenome</label>
                <input required type="text" placeholder="Silva" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Endereço de E-mail</label>
              <input required type="email" placeholder="nome@exemplo.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                <input required type="text" placeholder="(00) 00000-0000" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF ou CNPJ</label>
                <input required type="text" placeholder="000.000.000-00" value={formData.cpfCnpj} onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
            </div>

            {/* Código de Indicação */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 flex items-center gap-2">
                <Users className="size-3" /> Código de Indicação (Opcional)
              </label>
              <input 
                type="text" 
                placeholder="Ex: BRUNO123" 
                value={formData.referralCode} 
                onChange={(e) => {
                  const code = e.target.value.toUpperCase();
                  setFormData({ ...formData, referralCode: code });
                  fetchSponsor(code);
                }} 
                className="w-full bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-sm font-black text-primary outline-none focus:ring-2 focus:ring-primary/10 transition-all mt-1" 
              />
              {fetchingSponsor ? (
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Loader2 className="size-2 animate-spin" /> Buscando patrocinador...</p>
              ) : sponsorName ? (
                <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="size-2" /> Indicado por: <span className="uppercase">{sponsorName}</span>
                </p>
              ) : formData.referralCode ? (
                <p className="text-[10px] text-red-400 font-bold mt-1">Código de indicação inválido</p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                <input required type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar</label>
                <input required type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <>Finalizar Cadastro <ArrowRight className="size-4" /></>}
            </button>

            <p className="text-center text-xs font-bold text-slate-400">
              Já tem uma conta? <Link to="/login" className="text-primary hover:underline">Fazer login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
