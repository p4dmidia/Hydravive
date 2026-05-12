
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ChevronRight, 
  ArrowLeft,
  ExternalLink,
  Loader2,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Order {
  id: number;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  order_items: any[];
}

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-emerald-100 text-emerald-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700'
};

const statusLabels = {
  pending: 'Pendente',
  paid: 'Pago',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
};

export default function MyOrders() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, main_image_url)
          )
        `)
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-10">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Meus Pedidos</h1>
              <p className="text-slate-500 font-medium">Acompanhe o status de suas compras na Hydravive.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="size-10 text-primary animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Carregando histórico...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-20 text-center shadow-sm">
              <div className="size-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Package className="size-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase mb-2">Nenhum pedido encontrado</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">Você ainda não realizou nenhuma compra em nossa loja.</p>
              <button 
                onClick={() => navigate('/shop')}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                Ir para a Loja
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="p-8">
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg">
                          #{order.id}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data do Pedido</p>
                          <p className="text-slate-900 font-bold flex items-center gap-2">
                            <Calendar className="size-4 text-primary" />
                            {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">Status</p>
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]}`}>
                            {order.status === 'paid' && <CheckCircle2 className="size-3" />}
                            {order.status === 'shipped' && <Truck className="size-3" />}
                            {order.status === 'pending' && <Clock className="size-3" />}
                            {statusLabels[order.status]}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">Total</p>
                          <p className="text-xl font-black text-slate-900">
                            R$ {Number(order.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-4">
                            <div className="size-16 rounded-xl overflow-hidden bg-white border border-slate-200">
                              <img 
                                src={item.products?.main_image_url || 'https://via.placeholder.com/100'} 
                                alt={item.products?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.products?.name}</p>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Qtd: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-black text-slate-900">
                            R$ {Number(item.price_at_purchase * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <CreditCard className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{order.payment_method || 'Cartão de Crédito'}</span>
                      </div>
                      <button 
                        className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
                      >
                        Ver Detalhes do Envio
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
