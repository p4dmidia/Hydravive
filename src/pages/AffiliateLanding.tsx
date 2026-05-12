import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  Star,
  Users,
  Trophy,
  Rocket as RocketIcon,
  Headset,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function AffiliateLanding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingSponsor, setFetchingSponsor] = useState(false);
  const [sponsorName, setSponsorName] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    cpf: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'referralCode') {
      const code = value.toUpperCase();
      setFormData(prev => ({ ...prev, [name]: code }));
      fetchSponsor(code);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('As senhas não coincidem');
    }

    setLoading(true);
    console.log('Iniciando cadastro (Landing) para:', formData.email);
    try {
      // 1. Pular verificação para testar conexão
      /*
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
      */


      // 2. Sign up user com Metadados para o Trigger
      console.log('Chamando supabase.auth.signUp com metadados (Landing)...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            whatsapp: formData.whatsapp,
            cpfCnpj: formData.cpf, // No SQL esperamos cpfCnpj
            pixKey: formData.pixKey,
            sponsor_code: formData.referralCode,
            login: formData.firstName.toLowerCase() + Math.floor(Math.random() * 1000)
          }
        }
      });

      console.log('Resultado do signUp:', { authData, authError });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Falha ao criar usuário');

      // O Trigger SQL cuidará do resto (Perfil, Padrinho, Saldo)
      console.log('Cadastro concluído com sucesso via Trigger!');
      toast.success('Cadastro realizado com sucesso!');
      
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
    <main className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest">
              <Zap className="size-4" /> Oportunidade de Ouro
            </div>
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
              Ganhe Dinheiro <br /><span className="text-primary">Hidratando o Mundo</span>
            </h1>
            <p className="text-slate-400 text-lg lg:text-xl font-medium max-w-xl">
              Junte-se à Hydravive e transforme sua rede de contatos em uma fonte de renda recorrente com purificadores de alta tecnologia.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#register" className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-xl shadow-primary/20">
                Seja um Afiliado
              </a>
              <a href="#benefits" className="bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
                Saiba Mais
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 bg-primary/30 blur-[120px] rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800" 
              alt="Technology" 
              className="relative rounded-[3rem] shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </section>

      {/* Stats/Benefits */}
      <section id="benefits" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Target, 
              title: 'Comissões de até 30%', 
              desc: 'Ganhos agressivos por venda direta e recorrente.' 
            },
            { 
              icon: BarChart3, 
              title: 'Rede Multinível', 
              desc: 'Ganhe sobre as vendas de toda a sua equipe em até 10 níveis.' 
            },
            { 
              icon: ShieldCheck, 
              title: 'Pagamentos Semanais', 
              desc: 'Receba seus ganhos diretamente via PIX com total segurança.' 
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
              <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <benefit.icon className="size-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase mb-4">{benefit.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Form */}
      <section className="px-6 py-20 mb-20" id="register">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-hidden relative">
          <div className="flex flex-col gap-6 relative z-10">
            <h2 className="text-4xl font-black tracking-tight uppercase">Pronto para <br /><span className="text-primary">começar?</span></h2>
            <p className="text-slate-600 text-lg">
              Sua aprovação é imediata! Comece a lucrar agora mesmo.
            </p>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4">
                <Zap className="size-6 text-primary" />
                <span className="text-sm font-semibold">Aprovação imediata e automática</span>
              </div>
              <div className="flex items-center gap-4">
                <RocketIcon className="size-6 text-primary" />
                <span className="text-sm font-semibold">Acesso instantâneo ao treinamento</span>
              </div>
              <div className="flex items-center gap-4">
                <Headset className="size-6 text-primary" />
                <span className="text-sm font-semibold">Onboarding individual</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">Primeiro Nome</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 font-bold text-sm" placeholder="Bruno" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">Sobrenome</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 font-bold text-sm" placeholder="Silva" type="text" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Endereço de E-mail</label>
              <input required name="email" value={formData.email} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 font-bold text-sm" placeholder="bruno@exemplo.com" type="email" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">WhatsApp</label>
                <input required name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 font-bold text-sm" placeholder="(11) 99999-9999" type="tel" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">CPF ou CNPJ</label>
                <input required name="cpf" value={formData.cpf} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 font-bold text-sm" placeholder="000.000.000-00" type="text" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Chave PIX (E-mail, CPF ou Celular)</label>
              <input required name="pixKey" value={formData.pixKey} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 font-bold text-sm" placeholder="Sua chave PIX para recebimento" type="text" />
            </div>

            {/* Indicação MMN */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-primary flex items-center gap-2">
                <Users className="size-4" /> Código de Indicação (Opcional)
              </label>
              <input 
                name="referralCode"
                value={formData.referralCode} 
                onChange={handleChange} 
                className="bg-primary/5 border-primary/10 text-primary rounded-xl p-4 font-black uppercase placeholder:text-primary/30" 
                placeholder="EX: ADMIN10" 
                type="text" 
              />
              {fetchingSponsor ? (
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                  <Loader2 className="size-3 animate-spin" /> Verificando rede...
                </div>
              ) : sponsorName ? (
                <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase">
                  <CheckCircle2 className="size-3" /> Indicado por: {sponsorName}
                </div>
              ) : formData.referralCode ? (
                <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase">
                  Código de indicação não encontrado
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">Cadastro de Senha</label>
                <input required name="password" value={formData.password} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 font-bold text-sm" placeholder="••••••••" type="password" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">Confirmação de Senha</label>
                <input required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 font-bold text-sm" placeholder="••••••••" type="password" />
              </div>
            </div>

            <button 
              disabled={loading}
              className="bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-widest mt-4 hover:shadow-2xl hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" 
              type="submit"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <>Enviar Inscrição <ArrowRight className="size-4" /></>}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2 font-bold uppercase">Ao enviar, você concorda com nossos Termos de Afiliado.</p>
          </form>
        </div>
      </section>
    </main>
  );
}
