import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Star, 
  ShoppingCart, 
  ArrowUpDown,
  Tag,
  Loader2,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  PackageX,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  affiliate_price: number;
  points_cost: number;
  points: number;
  description: string;
  main_image_url: string;
  category_id: number;
  subcategory_id: number;
  rating: number;
  tags: string[];
  stock_quantity: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Subcategory {
  id: number;
  category_id: number;
  name: string;
}

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('relevant');
  const [hasReferral, setHasReferral] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('556296390724');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    fetchData();
    // Verifica indicação
    const ref = localStorage.getItem('hydravive_ref');
    setHasReferral(!!ref);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubcategory, maxPrice, sortBy, hasReferral]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, subRes] = await Promise.all([
        supabase.from('products').select('*').eq('is_active', true),
        supabase.from('product_categories').select('*').order('name'),
        supabase.from('product_subcategories').select('*').order('name')
      ]);

      if (prodRes.error) throw prodRes.error;
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setSubcategories(subRes.data || []);

      // Buscar WhatsApp de suporte
      const { data: settings } = await supabase.from('system_settings').select('value').eq('key', 'support_whatsapp').single();
      if (settings?.value) {
        // Remove caracteres não numéricos
        const cleanNumber = settings.value.replace(/\D/g, '');
        setWhatsappNumber(cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`);
      }
    } catch (error: any) {
      toast.error('Erro ao carregar a loja');
    } finally {
      setLoading(false);
    }
  };

  const isAffiliationProduct = (product: Product) => {
    const name = product.name ? product.name.toUpperCase() : '';
    return name === 'AFILIAÇÃO' || name === 'AFILIACAO' || name === 'AFILIAÇAO' || name === 'AFILIACÃO';
  };

  const isUserApproved = profile && profile.is_active === true;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true;
    const matchesSubcategory = selectedSubcategory ? product.subcategory_id === selectedSubcategory : true;
    const matchesPrice = Number(product.price) <= maxPrice;
    return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    return 0;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Evita navegar para a página de detalhes
    if (product.stock_quantity <= 0) {
      toast.error('Produto esgotado!');
      return;
    }

    addToCart({
      ...product,
      image: product.main_image_url,
      isAffiliate: profile?.role === 'affiliate' && profile?.is_active === true
    });

    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header da Loja */}
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-8">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Filter className="size-4" /> Categorias
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${!selectedCategory ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Todos os Produtos
                </button>
                {categories.map(cat => (
                  <div key={cat.id} className="space-y-1">
                    <button 
                      onClick={() => {
                        if (selectedCategory === cat.id) {
                          setSelectedCategory(null);
                          setSelectedSubcategory(null);
                        } else {
                          setSelectedCategory(cat.id);
                          setSelectedSubcategory(null);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${selectedCategory === cat.id ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {cat.name}
                      <ChevronRight className={`size-4 transition-transform ${selectedCategory === cat.id ? 'rotate-90' : ''}`} />
                    </button>
                    {selectedCategory === cat.id && (
                      <div className="pl-4 space-y-1 py-2">
                        {subcategories.filter(s => s.category_id === cat.id).map(sub => (
                          <button 
                            key={sub.id} 
                            onClick={() => setSelectedSubcategory(sub.id === selectedSubcategory ? null : sub.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${selectedSubcategory === sub.id ? 'text-primary bg-primary/5' : 'text-slate-500 hover:text-primary hover:bg-slate-50'}`}
                          >
                            <div className={`size-1.5 rounded-full ${selectedSubcategory === sub.id ? 'bg-primary' : 'bg-slate-300'}`} />
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Tag className="size-4" /> Preço Máximo
                </h3>
                <span className="text-sm font-black text-primary">R$ {maxPrice}</span>
              </div>
              <input 
                type="range" min="0" max="5000" step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-12">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="size-10 text-primary animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Carregando catálogo...</p>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center shadow-sm">
                <Search className="size-12 text-slate-200 mb-4" />
                <h3 className="text-xl font-black text-slate-900 uppercase">Nenhum produto encontrado</h3>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {currentProducts.map((product) => (
                    <div 
                      key={product.id} 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group bg-white rounded-[2.5rem] border border-slate-100 p-4 hover:shadow-2xl hover:shadow-primary/5 transition-all hover:-translate-y-2 cursor-pointer"
                    >
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-6">
                        <img 
                          src={product.main_image_url || 'https://via.placeholder.com/400'} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.stock_quantity <= 0 && (
                          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                            <span className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Esgotado</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="px-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                            {categories.find(c => c.id === product.category_id)?.name || 'Produto'}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="size-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-slate-900">{product.rating || '5.0'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                          {isUserApproved || isAffiliationProduct(product) ? (
                            <>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preço</p>
                                {profile?.role === 'affiliate' && profile?.is_active === true && product.affiliate_price > 0 ? (
                                  <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-400 line-through">
                                      R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-2xl font-black text-emerald-500 flex items-center gap-2">
                                      R$ {Number(product.affiliate_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md uppercase tracking-tighter">VIP</span>
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-2xl font-black text-slate-900">
                                    R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                )}
                              </div>
                              <button 
                                onClick={(e) => handleAddToCart(e, product)}
                                disabled={product.stock_quantity <= 0}
                                className={`size-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${product.stock_quantity <= 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/20'}`}
                              >
                                {product.stock_quantity <= 0 ? <PackageX className="size-5" /> : <ShoppingCart className="size-5" />}
                              </button>
                            </>
                          ) : (
                            <div className="w-full">
                              <a 
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto: ${product.name}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-green-500/10 animate-pulse"
                              >
                                <MessageSquare className="size-4" />
                                Saiba Mais
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-primary disabled:opacity-30 transition-all">
                      <ChevronLeft className="size-5" />
                    </button>
                    <div className="flex items-center gap-2 px-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button key={number} onClick={() => paginate(number)} className={`size-10 rounded-xl font-black text-sm transition-all ${currentPage === number ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white hover:text-primary border border-transparent hover:border-slate-200'}`}>
                          {number}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-primary disabled:opacity-30 transition-all">
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
