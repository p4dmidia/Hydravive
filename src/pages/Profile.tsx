import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Lock, 
  Save, 
  CheckCircle2, 
  Loader2,
  QrCode,
  MapPin
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface UserProfile {
  id: number;
  role: 'affiliate' | 'admin' | 'customer';
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  cpf?: string;
  pix_key?: string;
  pix_type?: string;
  cep?: string;
  address?: string;
  city?: string;
  state?: string;
  number?: string;
  complement?: string;
}

export default function ProfilePage() {
  const { user, profile, fetchProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    document: '',
    pix_key: '',
    pix_type: 'CPF',
    cep: '',
    address: '',
    city: '',
    state: '',
    number: '',
    complement: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        document: profile.cpf || '',
        pix_key: profile.pix_key || '',
        pix_type: profile.pix_type || 'CPF',
        cep: profile.cep || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        number: profile.number || '',
        complement: profile.complement || ''
      });
    } else if (user) {
      console.log('Profile: 👤 Perfil não disponível, usando apenas dados de Auth');
      setFormData(prev => ({
        ...prev,
        full_name: user.user_metadata?.full_name || '',
        email: user.email || ''
      }));
    }
  }, [profile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          mocha_user_id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          cpf: formData.document,
          pix_key: formData.pix_key,
          pix_type: formData.pix_type,
          cep: formData.cep,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          number: formData.number,
          complement: formData.complement,
          updated_at: new Date().toISOString()
        }, { onConflict: 'mocha_user_id' });

      if (error) throw error;

      setSaveSuccess(true);
      fetchProfile();
      toast.success('Perfil salvo!');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      toast.error('Erro ao salvar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Usuário';

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Meu Perfil</h2>
          <p className="text-slate-500">Gerencie suas informações e configurações da conta.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Card: Informações Básicas */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="size-4 text-primary" />
                Informações Pessoais
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.full_name} 
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">E-mail</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 font-medium cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">CPF / CNPJ</label>
                <input 
                  type="text" 
                  value={formData.document} 
                  onChange={e => setFormData({...formData, document: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Card: Endereço de Entrega */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                Endereço de Entrega
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">CEP</label>
                  <input 
                    type="text" 
                    value={formData.cep} 
                    onChange={e => setFormData({...formData, cep: e.target.value})}
                    placeholder="00000-000"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Rua / Logradouro</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Número</label>
                  <input 
                    type="text" 
                    value={formData.number} 
                    onChange={e => setFormData({...formData, number: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Complemento</label>
                  <input 
                    type="text" 
                    value={formData.complement} 
                    onChange={e => setFormData({...formData, complement: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Cidade</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Estado (UF)</label>
                  <input 
                    type="text" 
                    value={formData.state} 
                    onChange={e => setFormData({...formData, state: e.target.value})}
                    placeholder="EX: SP"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Dados Financeiros */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <QrCode className="size-4 text-primary" />
                Dados de Recebimento (PIX)
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Chave</label>
                <select 
                  value={formData.pix_type} 
                  onChange={e => setFormData({...formData, pix_type: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                >
                  <option>CPF</option>
                  <option>E-mail</option>
                  <option>Telefone</option>
                  <option>Aleatória</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Chave PIX</label>
                <input 
                  type="text" 
                  value={formData.pix_key} 
                  onChange={e => setFormData({...formData, pix_key: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  placeholder="Sua chave para saques"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="size-5 animate-spin" /> : saveSuccess ? <CheckCircle2 className="size-5" /> : <Save className="size-5" />}
              {isSaving ? 'Salvando...' : saveSuccess ? 'Salvo!' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
