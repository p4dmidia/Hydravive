import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar, 
  Loader2,
  Edit,
  X,
  Save,
  CreditCard,
  Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface Affiliate {
  id: number;
  mocha_user_id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  phone?: string;
  cpf?: string;
  pix_key?: string;
  activation_status?: {
    is_active_this_month: boolean;
    has_sale: boolean;
    has_referral: boolean;
  };
}

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingUser, setEditingUser] = useState<Affiliate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const { data: profiles, error: profilesErr } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesErr) throw profilesErr;

      let statusMap = new Map();
      try {
        const { data: statusData, error: statusErr } = await supabase
          .from('affiliate_activation_status')
          .select('*');
        if (!statusErr && statusData) {
          statusMap = new Map(statusData.map(s => [s.user_id, s]));
        }
      } catch (e) {
        console.warn('View affiliate_activation_status não encontrada, pulando carga de ativação.');
      }

      const merged = (profiles || []).map(p => ({
        ...p,
        activation_status: statusMap.get(p.id) || { is_active_this_month: false, has_sale: false, has_referral: false }
      }));

      setAffiliates(merged);
    } catch (error: any) {
      toast.error('Erro ao carregar afiliados');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: editingUser.full_name,
          email: editingUser.email,
          phone: editingUser.phone,
          cpf: editingUser.cpf,
          pix_key: editingUser.pix_key,
          role: editingUser.role,
          is_active: editingUser.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      
      setAffiliates(affiliates.map(a => a.id === editingUser.id ? editingUser : a));
      toast.success('Dados atualizados com sucesso!');
      setEditingUser(null);
    } catch (error: any) {
      toast.error('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, is_active: !currentStatus } : a));
      toast.success('Status atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('TEM CERTEZA? Esta ação excluirá permanentemente o perfil do usuário e não pode ser desfeita.')) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAffiliates(affiliates.filter(a => a.id !== id));
      toast.success('Usuário removido com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao excluir usuário');
    }
  };

  const filteredAffiliates = affiliates.filter(a => 
    (a.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (a.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (a.phone || '').includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="space-y-8 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Users className="text-primary size-8" />
              Gestão de Usuários
            </h2>
            <p className="text-slate-500 mt-1">Controle total sobre afiliados, administradores e clientes.</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-[2rem] p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F172A] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="size-10 text-primary animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuário</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contato</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Permissão</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ativação Mensal</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAffiliates.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-lg border shadow-inner ${item.role === 'admin' ? 'bg-amber-500/20 border-amber-500/20 text-amber-500' : 'bg-primary/20 border-primary/20 text-primary'}`}>
                            {item.full_name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="text-white font-bold">{item.full_name || 'Sem Nome'}</p>
                            <p className="text-[10px] text-primary/60 font-bold lowercase tracking-tight mb-1">{item.email}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                              {item.is_active ? <UserCheck className="size-3 text-emerald-500" /> : <UserX className="size-3 text-red-500" />}
                              {item.is_active ? 'Conta Ativa' : 'Conta Inativa'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Phone className="size-3 text-slate-500" />
                            {item.phone || 'N/A'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-bold tracking-tight">
                            CPF: {item.cpf || 'Não informado'}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {item.role === 'customer' ? (
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">-</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              item.activation_status?.is_active_this_month
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : 'bg-rose-500/15 text-rose-500'
                            }`}>
                              {item.activation_status?.is_active_this_month ? 'Ativo' : 'Inativo'}
                            </span>
                            {item.activation_status?.is_active_this_month && (
                              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                                {item.activation_status?.has_sale && item.activation_status?.has_referral
                                  ? 'Venda & Indicação'
                                  : item.activation_status?.has_sale
                                  ? 'Venda Direta'
                                  : item.activation_status?.has_referral
                                  ? 'Indicação'
                                  : 'Ativação Direta'}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setEditingUser(item)}
                            className="p-2.5 bg-white/5 hover:bg-primary/10 hover:text-primary text-slate-500 rounded-xl transition-all"
                            title="Editar Dados"
                          >
                            <Edit className="size-5" />
                          </button>
                          <button 
                            onClick={() => toggleStatus(item.id, item.is_active)}
                            className={`p-2.5 rounded-xl transition-all ${item.is_active ? 'bg-red-500/5 text-red-500/50 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/5 text-emerald-500/50 hover:bg-emerald-500 hover:text-white'}`}
                            title={item.is_active ? "Bloquear Usuário" : "Ativar Usuário"}
                          >
                            {item.is_active ? <UserX className="size-5" /> : <UserCheck className="size-5" />}
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2.5 bg-red-500/5 text-red-500/50 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                            title="Excluir Permanentemente"
                          >
                            <Trash2 className="size-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-md">
            <div className="bg-[#1E293B] border border-white/10 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                    <Edit className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Editar Usuário</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">ID: {editingUser.id}</p>
                  </div>
                </div>
                <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                  <X className="size-6 text-slate-500" />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={editingUser.full_name || ''}
                    onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail de Acesso</label>
                  <input 
                    type="email" 
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp</label>
                  <input 
                    type="text" 
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CPF / CNPJ</label>
                  <input 
                    type="text" 
                    value={editingUser.cpf || ''}
                    onChange={(e) => setEditingUser({...editingUser, cpf: e.target.value})}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Chave PIX</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={editingUser.pix_key || ''}
                      onChange={(e) => setEditingUser({...editingUser, pix_key: e.target.value})}
                      className="w-full bg-[#0F172A] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cargo / Permissão</label>
                  <select 
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                  >
                    <option value="affiliate">Afiliado</option>
                    <option value="admin">Administrador</option>
                    <option value="customer">Cliente</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status da Conta</label>
                  <select 
                    value={editingUser.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditingUser({...editingUser, is_active: e.target.value === 'true'})}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                  >
                    <option value="true">Ativa</option>
                    <option value="false">Bloqueada / Inativa</option>
                  </select>
                </div>
              </div>

              <div className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
                <button 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-[2] bg-primary hover:brightness-110 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
