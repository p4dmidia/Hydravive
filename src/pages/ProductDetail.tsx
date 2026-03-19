import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RefreshCcw, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';


export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = PRODUCTS.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
        <Link to="/shop" className="text-primary font-bold hover:underline flex items-center gap-2">
          <ArrowLeft className="size-4" /> Voltar para a Loja
        </Link>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState(product.image);
  const images = product.images || [product.image];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-bold text-sm">
        <ArrowLeft className="size-4" /> Voltar para a Loja
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="flex flex-col gap-6">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm relative group">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-white/20">
                {product.category}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-2xl bg-white border-2 overflow-hidden transition-all ${activeImage === img ? 'border-primary ring-4 ring-primary/10' : 'border-slate-100 opacity-50 hover:opacity-100 hover:border-slate-200'}`}
              >
                 <img src={img} className="w-full h-full object-cover" alt={`${product.name} - View ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`size-4 ${i < product.rating ? 'fill-current' : 'text-slate-200'}`} />
              ))}
              <span className="ml-2 text-sm font-bold text-slate-500">({product.rating}.0 • 128 avaliações)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">{product.name}</h1>
            <p className="text-3xl font-black text-primary mt-2">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-slate-900">Descrição</h3>
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.features.map(feature => (
              <div key={feature} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="size-5 text-primary shrink-0" />
                <span className="text-sm font-bold text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="size-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="size-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 ${added ? 'bg-emerald-500' : 'bg-primary'} text-white h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/20 transition-all hover:brightness-110 active:scale-95`}
              >
                {added ? (
                  <>
                    <ShieldCheck className="size-5" />
                    Adicionado!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-5" />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <Truck className="size-5 text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Entrega Grátis</p>
                  <p className="text-[10px] text-slate-500">Em pedidos acima de R$ 500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCcw className="size-5 text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Troca Grátis</p>
                  <p className="text-[10px] text-slate-500">Prazo de até 30 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
