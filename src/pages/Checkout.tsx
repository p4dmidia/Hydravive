import React from 'react';
import { Lock, ShieldCheck, CreditCard, Wallet, Smartphone, Truck, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  
  const subtotal = totalPrice;
  const delivery = 0;
  const taxes = subtotal * 0.08; // Example tax calculation
  const finalTotal = subtotal + delivery + taxes;

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

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Forms */}
        <div className="flex-[1.5] flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Checkout Seguro</h1>
            <p className="text-slate-500 text-sm">Por favor, insira seus dados abaixo para concluir seu pedido.</p>
          </div>

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
                <input className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="João Silva" type="text" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Endereço de E-mail</label>
                <input className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="joao@exemplo.com" type="email" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Número de Telefone</label>
                <input className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="+55 (11) 90000-0000" type="tel" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Endereço</label>
                <input className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="Rua das Águias, 123" type="text" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Cidade</label>
                <input className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="São Paulo" type="text" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">CEP</label>
                <input className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="01001-000" type="text" />
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="text-primary size-5" />
                Método de Pagamento
              </h2>
            </div>
            <div className="p-6">
              <div className="flex border-b border-slate-100 mb-6">
                <button className="px-6 py-3 border-b-2 border-primary text-primary font-bold text-sm">Cartão de Crédito</button>
                <button className="px-6 py-3 border-b-2 border-transparent text-slate-400 hover:text-slate-600 font-bold text-sm">Pix</button>
                <button className="px-6 py-3 border-b-2 border-transparent text-slate-400 hover:text-slate-600 font-bold text-sm">Boleto</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Número do Cartão</label>
                  <div className="relative">
                    <input className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary pr-10" placeholder="0000 0000 0000 0000" type="text" />
                    <CreditCard className="absolute right-3 top-2.5 text-slate-400 size-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Data de Validade</label>
                  <input className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="MM/AA" type="text" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">CVV</label>
                  <input className="w-full rounded-lg border-slate-200 focus:ring-primary focus:border-primary" placeholder="123" type="text" />
                </div>
              </div>
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
                  <div key={item.id} className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <div className="size-20 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100">
                        <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-slate-500">{item.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-extrabold">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-0.5 scale-90 origin-right">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="size-6 flex items-center justify-center rounded hover:bg-white transition-colors"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="size-6 flex items-center justify-center rounded hover:bg-white transition-colors"
                            >
                              <Plus className="size-3" />
                            </button>
                            <button 
                              onClick={() => removeFromCart(item.id)}
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
                    <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest">Grátis</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Impostos estim.</span>
                    <span className="font-medium">R$ {taxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 rounded-xl mt-4 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                  <Lock className="size-4" />
                  Concluir Compra
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
