import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Lock, 
  Camera, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  QrCode
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="p-10 max-w-[1000px] mx-auto space-y-10 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-[#111618] text-4xl font-black tracking-tighter mb-1 uppercase">Meu Perfil</h2>
            <p className="text-slate-500 font-medium">Gerencie suas informações pessoais e configurações de segurança.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          {/* Avatar Section */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="size-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary text-4xl font-black overflow-hidden border-4 border-white shadow-xl">
                B
                {/* Fallback image if needed */}
                {/* <img src="avatar-url" className="size-full object-cover" /> */}
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 size-10 bg-slate-900 border-4 border-white rounded-xl flex items-center justify-center text-white hover:bg-primary transition-all shadow-lg group-hover:scale-110">
                <Camera className="size-4" />
              </button>
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-xl font-black text-slate-900">Bruno Silva</h3>
              <p className="text-sm text-slate-500">Membro desde Março de 2024 • Embaixador Elite</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Conta Verificada</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Plano Ativo</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Personal Info */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <User className="size-5" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Informações Pessoais</h4>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input type="text" defaultValue="Bruno Silva" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input type="email" defaultValue="bruno.silva@exemplo.com" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input type="text" defaultValue="(11) 98765-4321" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">CPF / CNPJ</label>
                    <div className="relative group">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input type="text" defaultValue="123.456.789-00" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8 h-fit">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Lock className="size-5" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Segurança</h4>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha Atual</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nova Senha</label>
                  <input type="password" placeholder="Mínimo 8 caracteres" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirmar Nova Senha</label>
                  <input type="password" placeholder="Repita a nova senha" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                </div>
              </div>
            </div>

            {/* Financial Section */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-900/10 space-y-8 md:col-span-2 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-primary flex items-center justify-center">
                    <QrCode className="size-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-white">Dados Financeiros (Saques)</h4>
                    <p className="text-xs text-white/50 font-medium">Sua chave PIX para recebimento de comissões.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex-1 md:flex-none md:w-64">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Tipo de Chave</span>
                    <select className="bg-transparent border-none outline-none text-sm font-black w-full p-0 focus:ring-0">
                      <option>CPF</option>
                      <option>E-mail</option>
                      <option>Telefone</option>
                      <option>Aleatória</option>
                    </select>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex-1 md:flex-none md:w-80">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Chave PIX</span>
                    <input type="text" defaultValue="123.456.789-00" className="bg-transparent border-none outline-none text-base font-black w-full p-0 focus:ring-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Bar */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[1000px] px-10 z-30">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 shadow-2xl flex items-center justify-between">
              <div className="hidden sm:flex items-center gap-3 text-slate-500">
                <AlertCircle className="size-4" />
                <p className="text-xs font-medium">Lembre-se de conferir todos os dados antes de salvar.</p>
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className={`flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                  saveSuccess 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20'
                }`}
              >
                {isSaving ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saveSuccess ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <Save className="size-5" />
                )}
                <span>{isSaving ? 'Salvando...' : saveSuccess ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
