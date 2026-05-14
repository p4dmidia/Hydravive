import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus,
  Zap, 
  Rocket as RocketIcon,
  Headset,
  Loader2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function RegisterReferral() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

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

  // Preencher o código de indicação automaticamente
  useEffect(() => {
    if (profile?.referral_code) {
      setFormData(prev => ({ ...prev, referralCode: profile.referral_code }));
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('As senhas não coincidem');
    }

    if (!formData.referralCode) {
      return toast.error('Seu código de indicação não foi encontrado. Por favor, contate o suporte.');
    }

    setLoading(true);
    try {
      // Sign up user com Metadados para o Trigger
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            whatsapp: formData.whatsapp,
            cpfCnpj: formData.cpf,
            pixKey: formData.pixKey,
            sponsor_code: formData.referralCode,
            login: formData.firstName.toLowerCase() + Math.floor(Math.random() * 1000)
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Falha ao criar usuário');

      toast.success('Novo indicado cadastrado com sucesso!');
      
      // Limpar formulário mantendo o referralCode
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        whatsapp: '',
        cpf: '',
        pixKey: '',
        password: '',
        confirmPassword: '',
        referralCode: profile?.referral_code || ''
      });
      
    } catch (error: any) {
      console.error('Erro ao cadastrar indicado:', error);
      toast.error(error.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <UserPlus className="size-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Cadastrar Novo Indicado</h2>
          </div>
          <p className="text-slate-500">Expanda sua rede cadastrando novos parceiros diretamente do seu painel.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Sidebar Informativa */}
            <div className="bg-slate-900 p-8 text-white flex flex-col gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-tight text-primary">Vantagens de indicar</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Ao cadastrar um novo indicado, você garante sua participação nas vendas dele e de toda a rede que ele construir.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Zap className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/90">Aprovação Direta</p>
                    <p className="text-[10px] text-slate-500 font-medium">O novo afiliado terá acesso instantâneo ao painel.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <RocketIcon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/90">Pontos MMN</p>
                    <p className="text-[10px] text-slate-500 font-medium">Todas as vendas geram pontos em sua rede.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/90">Segurança Total</p>
                    <p className="text-[10px] text-slate-500 font-medium">Dados protegidos e integrados ao sistema financeiro.</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Seu Código Ativo</span>
                </div>
                <p className="text-lg font-black tracking-tight text-white uppercase">{profile?.referral_code || 'CARREGANDO...'}</p>
              </div>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-2 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primeiro Nome</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-bold text-sm outline-none transition-all" placeholder="Ex: Bruno" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sobrenome</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-bold text-sm outline-none transition-all" placeholder="Ex: Silva" type="text" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Endereço de E-mail</label>
                  <input required name="email" value={formData.email} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-bold text-sm outline-none transition-all" placeholder="bruno@exemplo.com" type="email" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp</label>
                    <input required name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-bold text-sm outline-none transition-all" placeholder="(11) 99999-9999" type="tel" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CPF ou CNPJ</label>
                    <input required name="cpf" value={formData.cpf} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-bold text-sm outline-none transition-all" placeholder="000.000.000-00" type="text" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chave PIX (Para recebimentos)</label>
                  <input required name="pixKey" value={formData.pixKey} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-bold text-sm outline-none transition-all" placeholder="E-mail, CPF ou Telefone" type="text" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Definir Senha</label>
                    <input required name="password" value={formData.password} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-bold text-sm outline-none transition-all" placeholder="••••••••" type="password" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirmar Senha</label>
                    <input required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="bg-slate-50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-4 font-bold text-sm outline-none transition-all" placeholder="••••••••" type="password" />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest mt-4 hover:shadow-2xl hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-primary/10 active:scale-[0.98]" 
                  type="submit"
                >
                  {loading ? <Loader2 className="size-5 animate-spin" /> : <>Finalizar Cadastro do Indicado <ArrowRight className="size-4" /></>}
                </button>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                  O indicado receberá as instruções de acesso no e-mail cadastrado.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
