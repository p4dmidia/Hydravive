import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="size-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
          <ShoppingBag className="size-10 text-slate-300" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Seu carrinho está vazio</h1>
        <p className="text-slate-500 mb-8 max-w-sm">Parece que você ainda não adicionou nenhum produto. Comece a explorar nossa tecnologia.</p>
        <Link to="/shop" className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:shadow-xl transition-all uppercase tracking-widest text-sm">
          Ir para a Loja
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Meu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl group hover:border-primary/20 transition-all">
              <div className="size-24 sm:size-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{item.category}</p>
                <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                <p className="font-black text-primary mt-1 text-lg">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="size-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="size-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-400 mb-1">Subtotal</p>
                <p className="text-xl font-black text-slate-900">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="flex flex-col gap-6">
          <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] flex flex-col gap-6 sticky top-24">
            <h2 className="text-xl font-black uppercase tracking-widest border-b border-white/10 pb-4">Resumo do Pedido</h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Itens ({totalItems})</span>
                <span className="text-white font-bold">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Entrega</span>
                <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Grátis</span>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                <p className="text-3xl font-black">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <Link to="/checkout" className="w-full bg-primary text-white h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/20 transition-all hover:brightness-110 active:scale-95 text-sm mt-4">
              Finalizar Pedido
              <ArrowRight className="size-5" />
            </Link>
            <div className="flex items-center gap-3 justify-center text-slate-400 group cursor-default">
              <ShieldCheck className="size-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Pagamento 100% Seguro</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
