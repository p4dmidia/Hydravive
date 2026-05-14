import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Minus, 
  Plus,
  Package,
  Info,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  affiliate_price: number;
  points_cost: number;
  points: number;
  main_image_url: string;
  category_id: number;
  subcategory_id: number;
  stock_quantity: number;
  weight: number;
  width: number;
  height: number;
  length: number;
  rating: number;
}

interface ProductImage {
  image_url: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { profile } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [hasReferral, setHasReferral] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('556296390724');

  useEffect(() => {
    fetchProduct();
    const ref = localStorage.getItem('hydravive_ref');
    setHasReferral(!!ref);
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [prodRes, galleryRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('product_images').select('image_url').eq('product_id', id).order('order_index')
      ]);

      if (prodRes.error) throw prodRes.error;
      
      setProduct(prodRes.data);
      const galleryUrls = galleryRes.data?.map(img => img.image_url) || [];
      setGallery([prodRes.data.main_image_url, ...galleryUrls]);
      setActiveImage(prodRes.data.main_image_url);

      // Buscar WhatsApp de suporte
      const { data: settings } = await supabase.from('system_settings').select('value').eq('key', 'support_whatsapp').single();
      if (settings?.value) {
        const cleanNumber = settings.value.replace(/\D/g, '');
        setWhatsappNumber(cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`);
      }
    } catch (error) {
      toast.error('Produto não encontrado');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock_quantity <= 0) {
      toast.error('Produto esgotado!');
      return;
    }

    addToCart({
      ...product,
      image: product.main_image_url,
      isAffiliate: profile?.role === 'affiliate'
    }, quantity);

    toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
          <Link to="/shop" className="hover:text-primary transition-colors">Loja</Link>
          <ChevronRight className="size-3" />
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Galeria de Imagens */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm relative group">
              <img 
                src={activeImage || 'https://via.placeholder.com/800'} 
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                    Produto Esgotado
                  </div>
                </div>
              )}
            </div>
            
            {/* Miniaturas */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`size-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img ? 'border-primary shadow-lg shadow-primary/20' : 'border-white hover:border-slate-200'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full">
                  <Star className="size-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-amber-600">{product.rating || '5.0'}</span>
                </div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-1 rounded-full border border-primary/10">
                  Pronta Entrega
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                {product.name}
              </h1>
              
              {hasReferral && (
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="text-4xl font-black text-slate-900">
                    R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-slate-400 font-bold text-sm line-through">
                    R$ {(Number(product.price) * 1.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-100 space-y-6 shadow-sm">
              <p className="text-slate-600 leading-relaxed font-medium">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Package className="size-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponível</p>
                    <p className="text-sm font-black text-slate-900">
                      {isOutOfStock ? 'Sem estoque' : `${product.stock_quantity} unidades`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Truck className="size-5 text-emerald-500" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Envio</p>
                    <p className="text-sm font-black text-slate-900">Para todo Brasil</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {hasReferral ? (
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={isOutOfStock} className="size-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors disabled:opacity-30"><Minus className="size-4" /></button>
                    <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} disabled={isOutOfStock} className="size-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors disabled:opacity-30"><Plus className="size-4" /></button>
                  </div>

                  <button onClick={handleAddToCart} disabled={isOutOfStock} className={`flex-1 h-16 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-primary text-white shadow-primary/20 hover:brightness-110'}`}>
                    <ShoppingCart className="size-5" />
                    {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
                  </button>
                </div>
              ) : (
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto: ${product.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-16 bg-[#25D366] text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-500/20 hover:brightness-110 active:scale-95"
                >
                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Quero saber mais
                </a>
              )}

              <div className="flex items-center justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-500" /> Compra Segura</div>
                <div className="flex items-center gap-2"><Info className="size-4 text-primary" /> Garantia Original</div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Especificações Técnicas</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-slate-400 font-bold">Peso</div>
                <div className="text-slate-900 font-black text-right">{product.weight > 0 ? `${product.weight}kg` : '--'}</div>
                <div className="text-slate-400 font-bold">Dimensões (LxAxC)</div>
                <div className="text-slate-900 font-black text-right">{product.width > 0 ? `${product.width} x ${product.height} x ${product.length} cm` : '--'}</div>
                <div className="text-slate-400 font-bold">Categoria</div>
                <div className="text-slate-900 font-black text-right">Hydravive Core</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
