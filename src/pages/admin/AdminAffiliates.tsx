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
  Trash2,
  Workflow,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import Tree from 'react-d3-tree';

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
  sponsor_id?: number | null;
  referral_code?: string;
  activation_status?: {
    is_active_this_month: boolean;
    has_sale: boolean;
    has_referral: boolean;
  };
}

const wouldCreateCycle = (userId: number, potentialSponsorId: number, affiliatesList: Affiliate[]) => {
  if (userId === potentialSponsorId) return true;
  let currentId: number | null = potentialSponsorId;
  const visited = new Set<number>();
  while (currentId) {
    if (currentId === userId) return true;
    if (visited.has(currentId)) return true;
    visited.add(currentId);
    const profile = affiliatesList.find(a => a.id === currentId);
    currentId = profile?.sponsor_id || null;
  }
  return false;
};

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingUser, setEditingUser] = useState<Affiliate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [viewingNetworkUser, setViewingNetworkUser] = useState<Affiliate | null>(null);
  const [networkTreeData, setNetworkTreeData] = useState<any | null>(null);
  const [sponsorSearchQuery, setSponsorSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  useEffect(() => {
    if (!editingUser) {
      setSponsorSearchQuery('');
    }
  }, [editingUser]);

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

      // Buscar pedidos pagos para cruzamento inteligente
      const { data: paidOrders, error: ordersErr } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at, shipping_address')
        .eq('status', 'paid');
      
      if (!ordersErr && paidOrders) {
        setOrders(paidOrders);
      }

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
          sponsor_id: editingUser.sponsor_id,
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

  const getMatchingOrder = (email: string) => {
    if (!email) return null;
    return orders.find(order => {
      const addr = order.shipping_address;
      if (!addr) return false;
      const orderEmail = typeof addr === 'string' ? JSON.parse(addr).email : addr.email;
      return orderEmail?.toLowerCase() === email.toLowerCase();
    });
  };

  const handleViewNetwork = (user: Affiliate) => {
    const profileMap = new Map();
    for (const p of affiliates) {
      const sId = String(p.id);
      const name = p.full_name || p.email?.split('@')[0] || 'Afiliado';
      profileMap.set(sId, {
        id: sId,
        name: name,
        username: name.toLowerCase().replace(/\s/g, ''),
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
        status: p.is_active ? 'active' : 'inactive',
        level: 0,
        phone: p.phone || '---',
        email: p.email || '---',
        children: []
      });
    }

    for (const p of affiliates) {
      const sId = String(p.id);
      const sponsorId = p.sponsor_id ? String(p.sponsor_id) : null;
      if (sponsorId && profileMap.has(sponsorId)) {
        const childNode = profileMap.get(sId);
        if (childNode && sId !== sponsorId) {
          profileMap.get(sponsorId).children.push(childNode);
        }
      }
    }

    const rootNode = profileMap.get(String(user.id));
    if (rootNode) {
      const setL = (n: any, l: number) => {
        n.level = l;
        n.children?.forEach((c: any) => setL(c, l + 1));
      };
      setL(rootNode, 1);
      setNetworkTreeData(rootNode);
      setViewingNetworkUser(user);
    } else {
      toast.error('Não foi possível montar a árvore de rede.');
    }
  };

  const filteredAffiliates = affiliates.filter(a => 
    (a.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (a.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (a.phone || '').includes(searchTerm)
  );

  const affiliatesToDisplay = activeTab === 'pending'
    ? filteredAffiliates.filter(a => !a.is_active && a.role === 'affiliate')
    : filteredAffiliates;

  const totalItems = affiliatesToDisplay.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAffiliates = affiliatesToDisplay.slice(startIndex, startIndex + itemsPerPage);

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

        {/* Seleção de Abas */}
        <div className="flex gap-6 border-b border-white/5 pb-px">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-all ${
              activeTab === 'pending' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Aprovações Pendentes ({affiliates.filter(a => !a.is_active && a.role === 'affiliate').length})
            {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-all ${
              activeTab === 'all' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Todos os Usuários ({affiliates.length})
            {activeTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
          </button>
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
          ) : affiliatesToDisplay.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="font-bold text-sm">Nenhum registro encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuário</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contato</th>
                    {activeTab === 'pending' ? (
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Verificação de Pagamento</th>
                    ) : (
                      <>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Permissão</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ativação Mensal</th>
                      </>
                    )}
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedAffiliates.map((item) => (
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
                      {activeTab === 'pending' ? (
                        <td className="px-8 py-6">
                          {(() => {
                            const matchingOrder = getMatchingOrder(item.email);
                            if (matchingOrder) {
                              return (
                                <div className="flex flex-col gap-1">
                                  <span className="w-fit px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Compra Confirmada 🎉
                                  </span>
                                  <p className="text-[11px] text-slate-300 font-bold">
                                    Pedido #{matchingOrder.id} - R$ {Number(matchingOrder.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                  <p className="text-[9px] text-slate-500 font-bold uppercase">
                                    Pago em: {new Date(matchingOrder.created_at).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                              );
                            } else {
                              return (
                                <div className="flex flex-col gap-1">
                                  <span className="w-fit px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    Pagamento não encontrado
                                  </span>
                                  <p className="text-[10px] text-slate-500 font-medium">
                                    Nenhum pedido pago para o e-mail cadastrado
                                  </p>
                                </div>
                              );
                            }
                          })()}
                        </td>
                      ) : (
                        <>
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
                        </>
                      )}
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {activeTab === 'pending' ? (
                            <>
                              <button 
                                onClick={() => toggleStatus(item.id, item.is_active)}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-600/10 flex items-center gap-1.5 active:scale-95"
                                title="Aprovar Afiliado"
                              >
                                <UserCheck className="size-4" />
                                Aprovar
                              </button>
                              {item.role === 'affiliate' && (
                                <button 
                                  onClick={() => handleViewNetwork(item)}
                                  className="p-2.5 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-500 rounded-xl transition-all"
                                  title="Visualizar Rede"
                                >
                                  <Workflow className="size-5" />
                                </button>
                              )}
                              <button 
                                onClick={() => setEditingUser(item)}
                                className="p-2.5 bg-white/5 hover:bg-primary/10 hover:text-primary text-slate-500 rounded-xl transition-all"
                                title="Editar Dados"
                              >
                                <Edit className="size-5" />
                              </button>
                            </>
                          ) : (
                            <>
                               {item.role === 'affiliate' && (
                                 <button 
                                   onClick={() => handleViewNetwork(item)}
                                   className="p-2.5 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-500 rounded-xl transition-all"
                                   title="Visualizar Rede"
                                 >
                                   <Workflow className="size-5" />
                                 </button>
                               )}
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
                            </>
                          )}
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
              
              {/* Controles de Paginação */}
              {totalPages > 1 && (
                <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Exibindo <span className="text-white">{startIndex + 1}</span> a <span className="text-white">{Math.min(startIndex + itemsPerPage, totalItems)}</span> de <span className="text-white">{totalItems}</span> usuários
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-white rounded-xl transition-all"
                      title="Página Anterior"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;
                      let start = Math.max(1, currentPage - 2);
                      let end = Math.min(totalPages, start + maxVisible - 1);
                      if (end - start < maxVisible - 1) {
                        start = Math.max(1, end - maxVisible + 1);
                      }
                      
                      for (let i = start; i <= end; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`size-10 rounded-xl text-xs font-black transition-all ${
                              currentPage === i
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      return pages;
                    })()}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-white rounded-xl transition-all"
                      title="Próxima Página"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                </div>
              )}
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
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Patrocinador</label>
                  {editingUser.sponsor_id && affiliates.some(a => a.id === editingUser.sponsor_id) ? (
                    (() => {
                      const currentSponsor = affiliates.find(a => a.id === editingUser.sponsor_id)!;
                      return (
                        <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white font-bold text-sm">
                              {currentSponsor.full_name || 'Sem Nome'} (ID: {currentSponsor.id})
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                              {currentSponsor.email} {currentSponsor.phone ? `| ${currentSponsor.phone}` : ''}
                            </p>
                            <p className="text-slate-500 text-[10px] font-bold mt-1">
                              {currentSponsor.cpf ? `CPF: ${currentSponsor.cpf}` : 'Sem CPF informado'}
                            </p>
                            {currentSponsor.referral_code && (
                              <span className="mt-2 inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                                Código: {currentSponsor.referral_code}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingUser({ ...editingUser, sponsor_id: null })}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                          >
                            Remover
                          </button>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Pesquisar por nome, ID, CPF, e-mail ou código de afiliação..."
                          value={sponsorSearchQuery}
                          onChange={(e) => setSponsorSearchQuery(e.target.value)}
                          className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:text-slate-600 text-sm"
                        />
                        {sponsorSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setSponsorSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
                          >
                            Limpar
                          </button>
                        )}
                      </div>

                      {sponsorSearchQuery.trim() !== '' && (
                        <div className="bg-[#0F172A] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5 max-h-60 overflow-y-auto">
                          {(() => {
                            const query = sponsorSearchQuery.toLowerCase().trim();
                            const matches = affiliates.filter(a => {
                              if (a.id === editingUser.id) return false;
                              if (a.role !== 'affiliate' && a.role !== 'admin') return false;
                              
                              return (
                                String(a.id).includes(query) ||
                                (a.full_name || '').toLowerCase().includes(query) ||
                                (a.email || '').toLowerCase().includes(query) ||
                                (a.cpf || '').includes(query) ||
                                (a.referral_code || '').toLowerCase().includes(query)
                              );
                            });

                            if (matches.length === 0) {
                              return (
                                <p className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider">
                                  Nenhum patrocinador encontrado
                                </p>
                              );
                            }

                            return matches.slice(0, 8).map(a => (
                              <button
                                key={a.id}
                                type="button"
                                onClick={() => {
                                  if (wouldCreateCycle(editingUser.id, a.id, affiliates)) {
                                    toast.error('Não é possível selecionar este patrocinador pois criaria uma referência circular (loop).');
                                    return;
                                  }
                                  setEditingUser({ ...editingUser, sponsor_id: a.id });
                                  setSponsorSearchQuery('');
                                }}
                                className="w-full text-left p-4 hover:bg-white/[0.03] transition-colors flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-white font-bold text-xs uppercase">
                                    {a.full_name || 'Sem Nome'} (ID: {a.id})
                                  </p>
                                  <p className="text-slate-500 text-[10px] font-semibold mt-0.5">
                                    {a.email} {a.cpf ? `| CPF: ${a.cpf}` : ''}
                                  </p>
                                </div>
                                {a.referral_code && (
                                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                                    {a.referral_code}
                                  </span>
                                )}
                              </button>
                            ));
                          })()}
                        </div>
                      )}
                      
                      {sponsorSearchQuery.trim() === '' && (
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">
                          Sem Patrocinador (Indicação Direta). Digite acima para buscar e definir um patrocinador.
                        </p>
                      )}
                    </div>
                  )}
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
        {/* Modal de Rede de Indicações */}
        {viewingNetworkUser && networkTreeData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-md">
            <div className="bg-[#1E293B] border border-white/10 rounded-[2.5rem] w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Workflow className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Rede de Indicações</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                      Patrocinador Raiz: {viewingNetworkUser.full_name} ({viewingNetworkUser.email})
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { setViewingNetworkUser(null); setNetworkTreeData(null); }} 
                  className="p-2 hover:bg-white/5 rounded-xl transition-all"
                >
                  <X className="size-6 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 bg-[#0F172A]/50 relative overflow-hidden">
                <div className="absolute inset-0">
                  <Tree
                    data={networkTreeData}
                    orientation="vertical"
                    pathFunc="step"
                    enableLegacyTransitions={false}
                    transitionDuration={0}
                    translate={{ x: 450, y: 80 }}
                    nodeSize={{ x: 260, y: 160 }}
                    separation={{ siblings: 1.3, nonSiblings: 1.8 }}
                    renderCustomNodeElement={(rd3tProps) => (
                      <foreignObject width="240" height="100" x="-120" y="-50">
                        <div className="bg-slate-900 rounded-2xl p-4 shadow-xl border border-white/5 flex items-center gap-3 w-full h-full">
                          <div className="relative">
                            <img 
                              src={rd3tProps.nodeDatum.avatar as string} 
                              className="size-10 rounded-xl object-cover border border-white/10"
                              alt=""
                            />
                            <div className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border border-slate-950 ${rd3tProps.nodeDatum.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="text-white font-bold text-xs truncate uppercase tracking-tight">{rd3tProps.nodeDatum.name}</h4>
                            <p className="text-emerald-400 font-bold text-[9px] uppercase tracking-wider">Nível {rd3tProps.nodeDatum.level}</p>
                            <p className="text-slate-500 text-[8px] truncate">{rd3tProps.nodeDatum.email}</p>
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  />
                </div>
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => { setViewingNetworkUser(null); setNetworkTreeData(null); }}
                  className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-bold transition-all"
                >
                  Fechar Visualização
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
