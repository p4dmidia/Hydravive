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
  AlertCircle,
  MessageSquare
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

function formatDescription(text: string) {
  if (!text) return null;
  
  // Normalizar quebras de linha
  let formatted = text.replace(/\r\n/g, '\n');
  
  // Inserir quebra de linha antes de marcadores comuns (✓, •, -) se já não houver uma
  formatted = formatted.replace(/([^\n])\s*✓/g, '$1\n✓');
  formatted = formatted.replace(/([^\n])\s*•/g, '$1\n•');
  formatted = formatted.replace(/([^\n])\s*-\s+/g, '$1\n- ');
  
  const paragraphs = formatted.split('\n').filter(p => p.trim() !== '');
  
  return paragraphs.map((paragraph, index) => {
    const trimmed = paragraph.trim();
    const isBullet = trimmed.startsWith('✓') || trimmed.startsWith('•') || trimmed.startsWith('-');
    
    return (
      <span 
        key={index} 
        className={`block text-slate-600 leading-relaxed font-medium ${index > 0 ? 'mt-3' : ''} ${
          isBullet 
            ? 'pl-3 border-l-2 border-emerald-500/40 bg-emerald-500/5 py-1.5 px-3 rounded-r-2xl' 
            : ''
        }`}
      >
        {paragraph}
      </span>
    );
  });
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { profile, loading: authLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [hasReferral, setHasReferral] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('556296390724');

  const isUserApproved = profile && profile.is_active === true;
  const isAffiliation = product?.name ? (
    product.name.toUpperCase() === 'AFILIAÇÃO' || 
    product.name.toUpperCase() === 'AFILIACAO' || 
    product.name.toUpperCase() === 'AFILIAÇAO' || 
    product.name.toUpperCase() === 'AFILIACÃO'
  ) : false;

  useEffect(() => {
    if (!authLoading) {
      fetchProduct();
    }
    const ref = localStorage.getItem('hydravive_ref');
    setHasReferral(!!ref);
  }, [id, authLoading]);

  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [prodRes, galleryRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('product_images').select('image_url').eq('product_id', id).order('order_index')
      ]);

      if (prodRes.error) throw prodRes.error;
      
      const fetchedProduct = prodRes.data;
      
      // Verifica se o usuário está aprovado (usando variáveis locais para evitar problemas de concorrência com o state)
      const isUserApprovedLocal = profile && profile.is_active === true;
      const isAffiliationLocal = fetchedProduct.name && (
        fetchedProduct.name.toUpperCase() === 'AFILIAÇÃO' || 
        fetchedProduct.name.toUpperCase() === 'AFILIACAO' || 
        fetchedProduct.name.toUpperCase() === 'AFILIAÇAO' || 
        fetchedProduct.name.toUpperCase() === 'AFILIACÃO'
      );
      
      if (isUserApprovedLocal && isAffiliationLocal) {
        toast.error('Você já é um afiliado ativo.');
        navigate('/shop');
        return;
      }

      setProduct(fetchedProduct);
      const galleryUrls = galleryRes.data?.map(img => img.image_url) || [];
      setGallery([fetchedProduct.main_image_url, ...galleryUrls]);
      setActiveImage(fetchedProduct.main_image_url);

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
      isAffiliate: profile?.role === 'affiliate' && profile?.is_active === true
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
              
              {(isUserApproved || isAffiliation) ? (
                profile?.role === 'affiliate' && profile?.is_active === true && product.affiliate_price > 0 ? (
                  <div className="mt-6 flex flex-col gap-0.5">
                    <p className="text-sm font-bold text-slate-400 line-through">
                      R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-4xl font-black text-emerald-500 flex items-center gap-3">
                      R$ {Number(product.affiliate_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      <span className="text-xs bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-lg uppercase tracking-wider font-black">VIP</span>
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 flex items-baseline gap-4">
                    <span className="text-4xl font-black text-slate-900">
                      R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-slate-400 font-bold text-sm line-through">
                      R$ {(Number(product.price) * 1.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )
              ) : (
                <div className="mt-6">
                  <span className="text-2xl font-black text-slate-400 uppercase tracking-widest">
                    Preço sob consulta
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-100 space-y-6 shadow-sm">
              <div className="space-y-3">
                {formatDescription(product.description)}
              </div>

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
              {(isUserApproved || isAffiliation) ? (
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
                  className="w-full h-16 bg-[#25D366] text-white rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-green-500/15 text-sm animate-pulse"
                >
                  <MessageSquare className="size-5" /> Comprar via WhatsApp
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
