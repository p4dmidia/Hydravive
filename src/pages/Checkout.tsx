import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, CreditCard, Wallet, Smartphone, Truck, Trash2, Plus, Minus, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { calculateShipping, ShippingOption } from '../services/shipping';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { profile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      }));
    }
  }, [profile]);

  const subtotal = totalPrice;
  const shippingCost = selectedShipping ? Number(selectedShipping.custom_price) : 0;
  const finalTotal = Math.round((subtotal + shippingCost) * 100) / 100;

  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      handleCalculateShipping(cleanCep);
    } else {
      setShippingOptions([]);
      setSelectedShipping(null);
    }
  }, [cep]);

  const handleCalculateShipping = async (targetCep: string) => {
    setLoadingShipping(true);
    try {
      const options = await calculateShipping(targetCep, cart);
      setShippingOptions(options);
      if (options.length > 0) {
        const cheapest = options.reduce((prev, curr) => 
          Number(prev.custom_price) < Number(curr.custom_price) ? prev : curr
        );
        setSelectedShipping(cheapest);
      }
    } catch (error) {
      toast.error('Erro ao calcular frete. Verifique o CEP.');
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleCheckout = async () => {
    if (!formData.fullName || !formData.email || !cep || !selectedShipping) {
      toast.error('Por favor, preencha todos os campos obrigatórios e selecione o frete.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Checkout: 🛒 Preparando pedido...', {
        total_amount: finalTotal,
        user_id: profile?.id,
        items_count: cart.length
      });

      // 1. Criar o pedido no banco
      console.log('Checkout: 📝 Invocando RPC create_checkout_v3...', {
        total_amount: finalTotal,
        user_id: profile?.id,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price,
          points_at_purchase: item.usePoints ? item.points_cost : 0
        }))
      });

      const { data: order, error: orderError } = await supabase.rpc('create_checkout_v3', {
        payload: {
          total_amount: finalTotal,
          user_id: profile?.id || null,
          referral_code: localStorage.getItem('hydravive_ref'), // CAPTURA O AFILIADO DO LINK
          shipping_method: selectedShipping.name,
          shipping_cost: shippingCost,
          shipping_address: {
            ...formData,
            cep
          },
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
            points_at_purchase: item.points_cost
          }))
        }
      });

      if (orderError) {
        console.error('Checkout: ❌ Erro detalhado no RPC:', orderError);
        throw orderError;
      }

      console.log('Checkout: ✅ Pedido criado via RPC com sucesso:', order.id);

      // 3. Gerar link de pagamento na InfinitePay via Edge Function
      const paymentItems = [
        ...cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      ];

      if (shippingCost > 0) {
        paymentItems.push({
          name: `Frete (${selectedShipping.name})`,
          quantity: 1,
          price: shippingCost
        });
      }

      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('infinitepay-checkout', {
        body: {
          items: paymentItems,
          order_id: order.id,
          customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone
          },
          redirect_url: `${window.location.origin}/dashboard/financial`
        }
      });

      if (paymentError) throw paymentError;

      if (paymentData?.url) {
        toast.success('Redirecionando para o pagamento...');
        window.location.href = paymentData.url;
      } else {
        throw new Error('Link de pagamento não gerado');
      }
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error('Erro ao finalizar pedido: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <span className="text-slate-500">Início</span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-500">Carrinho</span>
        <span className="text-slate-400">/</span>
        <span className="text-primary font-bold">Checkout Seguro</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Left Side: Forms */}
        <div className="flex-[1.5] flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Checkout Seguro</h1>
            <p className="text-slate-500 text-sm">Por favor, insira seus dados abaixo para concluir seu pedido.</p>
          </div>

          {/* Login CTA for Guests */}
          {!profile && (
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-900/20">
              <div className="flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Lock className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Já possui uma conta?</h3>
                  <p className="text-white/60 text-sm">Faça login para finalizar sua compra em poucos segundos.</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 whitespace-nowrap"
              >
                Entrar na Conta
              </button>
            </div>
          )}

          {/* Progress Bar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between mb-3">
              <p className="text-sm font-semibold">Passo 2 de 3: Envio e Pagamento</p>
              <p className="text-sm font-bold text-primary">66%</p>
            </div>
            <div className="rounded-full bg-slate-100 h-2.5 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '66%' }}></div>
            </div>
          </div>

          {/* Shipping Section */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Truck className="text-primary size-5" />
                Detalhes de Envio
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nome Completo</label>
                <input 
                  className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" 
                  placeholder="Digite seu nome completo" 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Endereço de E-mail</label>
                <input 
                  className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" 
                  placeholder="exemplo@email.com" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Número de Telefone</label>
                <input 
                  className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" 
                  placeholder="(00) 00000-0000 (WhatsApp)" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Endereço</label>
                <input 
                  className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" 
                  placeholder="Nome da rua, nº e bairro" 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Cidade</label>
                <input 
                  className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" 
                  placeholder="Digite sua cidade" 
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">CEP</label>
                <input 
                  className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" 
                  placeholder="00000-000" 
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  maxLength={9}
                />
              </div>
            </div>
          </section>

          {/* Shipping Options Section */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Truck className="text-primary size-5" />
                Opções de Entrega
              </h2>
              {loadingShipping && <Loader2 className="size-5 text-primary animate-spin" />}
            </div>
            <div className="p-6">
              {!cep || cep.replace(/\D/g, '').length < 8 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm italic">Insira seu CEP para ver as opções de entrega</p>
                </div>
              ) : loadingShipping ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="size-8 text-primary animate-spin" />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Buscando melhores tarifas...</p>
                </div>
              ) : shippingOptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-red-400 text-sm">Nenhuma opção de frete disponível para este CEP.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {shippingOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedShipping(option)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedShipping?.id === option.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <Truck className="size-6 text-slate-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm text-slate-900">{option.name}</p>
                          <p className="text-xs text-slate-500">Prazo: {option.delivery_time} dias úteis</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-black text-slate-900">R$ {Number(option.custom_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedShipping?.id === option.id ? 'border-primary bg-primary text-white' : 'border-slate-200'}`}>
                          {selectedShipping?.id === option.id && <CheckCircle2 className="size-4" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Right Side: Order Summary */}
        <div className="flex-1">
          <div className="sticky top-24 flex flex-col gap-6">
            <section className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h2 className="text-lg font-bold">Resumo do Pedido</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.usePoints}`} className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <div className="size-20 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100">
                        <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-sm line-clamp-1">
                          {item.name} {item.usePoints && '(Resgate)'}
                        </h3>
                        <p className="text-xs text-slate-500">{item.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-extrabold">
                            {item.usePoints 
                              ? `${item.points_cost} Pts` 
                              : `R$ ${(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                          </p>
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-0.5 scale-90 origin-right">
                            <button 
                              onClick={() => updateQuantity(item.id, item.usePoints, item.quantity - 1)}
                              className="size-6 flex items-center justify-center rounded hover:bg-white transition-colors"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.usePoints, item.quantity + 1)}
                              className="size-6 flex items-center justify-center rounded hover:bg-white transition-colors"
                            >
                              <Plus className="size-3" />
                            </button>
                            <button 
                              onClick={() => removeFromCart(item.id, item.usePoints)}
                              className="ml-1 p-1 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="border-slate-50 last:hidden" />
                  </div>
                ))}

                {cart.length === 0 && (
                  <p className="text-center text-slate-500 py-4 italic">Seu carrinho está vazio.</p>
                )}

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Envio</span>
                    <span className={shippingCost === 0 ? "text-green-500 font-bold uppercase text-[10px] tracking-widest" : "font-medium"}>
                      {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>
                  <hr className="border-slate-100 my-2" />
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-2xl font-extrabold text-primary">R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <input className="flex-1 text-sm rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="Cupom de desconto" type="text" />
                  <button className="px-4 py-2 bg-slate-100 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors">Aplicar</button>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-extrabold py-4 rounded-xl mt-4 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
                  {isSubmitting ? 'Processando...' : 'Concluir Compra'}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Ao clicar em "Concluir Compra", você concorda com os Termos de Serviço e Política de Privacidade da Hydravive.
                </p>
              </div>
            </section>

            {/* Trust Badges */}
            <div className="flex flex-col gap-4 px-2">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Satisfação Garantida</h4>
                  <p className="text-xs text-slate-500">Garantia de reembolso de 30 dias em todos os purificadores.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Lock className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Criptografia SSL Segura</h4>
                  <p className="text-xs text-slate-500">Seus dados pessoais e de pagamento estão totalmente protegidos.</p>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-2 opacity-50 grayscale hover:grayscale-0 transition-all text-slate-600">
                <CreditCard className="size-8" />
                <Wallet className="size-8" />
                <Smartphone className="size-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
