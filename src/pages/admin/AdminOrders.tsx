import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Package,
  User,
  CreditCard,
  Loader2,
  X,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product: {
    name: string;
  };
}

interface Order {
  id: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
  shipping_address: any;
  customer: {
    full_name: string;
    phone: string;
  };
  affiliate: {
    full_name: string;
  };
  order_items?: OrderItem[];
}

const statusLabels = {
  pending: 'Pendente',
  paid: 'Pago',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const statusColors = {
  pending: 'bg-amber-500/10 text-amber-500',
  paid: 'bg-emerald-500/10 text-emerald-500',
  shipped: 'bg-blue-500/10 text-blue-500',
  delivered: 'bg-primary/10 text-primary',
  cancelled: 'bg-red-500/10 text-red-500',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para Visualização
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    console.log('AdminOrders: 🔍 Buscando pedidos...');
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:user_profiles!user_id (full_name, phone),
          affiliate:user_profiles!affiliate_id (full_name),
          order_items (
            *,
            product:products!product_id (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('AdminOrders: ❌ Erro ao buscar pedidos:', JSON.stringify({
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        }, null, 2));
        throw error;
      }
      
      console.log('AdminOrders: ✅ Pedidos carregados:', data?.length || 0);
      setOrders(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar pedidos: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: number, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      toast.success('Status do pedido atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar pedido');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toString().includes(searchTerm) ||
    o.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <ShoppingCart className="text-primary size-8" />
              Gestão de Pedidos
            </h2>
            <p className="text-slate-500 mt-1">Monitore vendas e atualize o status logístico em português.</p>
          </div>
        </div>

        {/* Busca */}
        <div className="bg-[#1E293B] border border-white/5 rounded-[2rem] p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por ID do pedido ou nome do cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F172A] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Acessando banco de dados...</p>
          </div>
        ) : (
          <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pedido</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Cliente / Afiliado</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pagamento</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-white font-black text-lg">#00{item.id}</p>
                          <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1 uppercase tracking-widest">
                            <Calendar className="size-3" />
                            {new Date(item.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-primary" />
                            <p className="text-sm text-white font-bold">{item.customer?.full_name || 'Cliente Final'}</p>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Indicação: {item.affiliate?.full_name || 'Venda Direta'}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-white font-black">R$ {Number(item.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                            <CreditCard className="size-3" />
                            {item.payment_method || 'PIX'}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[item.status]}`}>
                          {statusLabels[item.status]}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.status === 'pending' && (
                            <button 
                              onClick={() => updateOrderStatus(item.id, 'paid')}
                              className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all"
                              title="Marcar como Pago"
                            >
                              <CheckCircle2 className="size-5" />
                            </button>
                          )}
                          <button 
                            onClick={() => setViewingOrder(item)}
                            className="p-3 bg-white/5 hover:bg-primary/10 hover:text-primary text-slate-500 rounded-xl transition-all"
                            title="Visualizar Pedido"
                          >
                            <Eye className="size-5" />
                          </button>
                          <select 
                            value={item.status}
                            onChange={(e) => updateOrderStatus(item.id, e.target.value as any)}
                            className="bg-[#0F172A] border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer hover:text-white"
                          >
                            <option value="pending">Pendente</option>
                            <option value="paid">Pago</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregue</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Detalhes do Pedido */}
        {viewingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-md">
            <div className="bg-[#1E293B] border border-white/10 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                    <ShoppingCart className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Detalhes do Pedido</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Nº #00{viewingOrder.id}</p>
                  </div>
                </div>
                <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                  <X className="size-6 text-slate-500" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Status e Info Geral */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0F172A] p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status Atual</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[viewingOrder.status]}`}>
                      {statusLabels[viewingOrder.status]}
                    </span>
                  </div>
                  <div className="bg-[#0F172A] p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Data da Compra</p>
                    <p className="text-white font-bold">{new Date(viewingOrder.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                {/* Cliente e Endereço */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="size-3 text-primary" /> Endereço de Entrega
                  </h4>
                  <div className="bg-[#0F172A] p-6 rounded-3xl border border-white/5 space-y-2">
                    <p className="text-white font-bold">{viewingOrder.customer?.full_name}</p>
                    <p className="text-sm text-slate-400">
                      {viewingOrder.shipping_address?.street}, {viewingOrder.shipping_address?.number}
                    </p>
                    <p className="text-sm text-slate-400">
                      {viewingOrder.shipping_address?.city} - {viewingOrder.shipping_address?.state}
                    </p>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Package className="size-3 text-primary" /> Itens do Pedido
                  </h4>
                  <div className="space-y-2">
                    {viewingOrder.order_items?.map((item) => (
                      <div key={item.id} className="bg-[#0F172A] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-slate-400 border border-white/10">
                            {item.quantity}x
                          </div>
                          <p className="text-white font-bold text-sm">{item.product?.name}</p>
                        </div>
                        <p className="text-primary font-black">R$ {Number(item.price_at_purchase).toLocaleString('pt-BR')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumo Financeiro */}
                <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Total do Pedido</p>
                    <p className="text-white text-xs font-bold">Pago via {viewingOrder.payment_method || 'PIX'}</p>
                  </div>
                  <p className="text-white font-black text-3xl">R$ {Number(viewingOrder.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="p-8 bg-white/5 border-t border-white/5">
                <button 
                  onClick={() => setViewingOrder(null)}
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs"
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
