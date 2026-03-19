import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Star, ShoppingCart, Filter, X, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';


const CATEGORIES = ['Todos', 'Purificadores', 'Acessórios', 'Filtros'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'Todos');
  const [sortBy, setSortBy] = useState('relevant');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat)) {
      setCategory(cat);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'Todos' || p.category === category) &&
      p.price <= maxPrice
    );

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [search, category, sortBy, maxPrice]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat === 'Todos') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Loja Hydravive</h1>
            <p className="text-slate-500">Encontre a tecnologia perfeita para sua hidratação.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar produtos..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all md:hidden"
            >
              <Filter className="size-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Categorias</h3>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      category === cat 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Preço Máximo</h3>
                <span className="text-xs font-black text-primary">R$ {maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="3000" 
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                <span>R$ 0</span>
                <span>R$ 3000</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Ordenar por</h3>
              <select 
                className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:border-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevant">Mais Relevantes</option>
                <option value="price-low">Menor Preço</option>
                <option value="price-high">Maior Preço</option>
              </select>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Oferta</p>
                <h4 className="font-bold mb-4">Frete grátis em pedidos acima de R$ 500</h4>
                <Link to="/shop?category=Purificadores" className="text-xs font-black uppercase underline decoration-primary underline-offset-4 hover:text-primary transition-colors">Ver Purificadores</Link>
              </div>
              <SlidersHorizontal className="absolute -bottom-4 -right-4 size-24 text-white/5" />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group flex flex-col bg-white border border-slate-100 rounded-[2rem] p-4 hover:shadow-2xl hover:shadow-primary/5 transition-all">
                    <Link to={`/product/${product.id}`} className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {product.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-slate-900 border border-white/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                    <div className="flex flex-col gap-4 px-2 pb-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">{product.category}</p>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="size-3 fill-current" />
                            <span className="text-xs font-bold text-slate-500">{product.rating}.0</span>
                          </div>
                        </div>
                        <Link to={`/product/${product.id}`} className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{product.name}</Link>
                        <span className="text-xl font-black text-slate-900 mt-1">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-full bg-slate-900 text-white h-11 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                        >
                          <ShoppingCart className="size-4" />
                          Adicionar
                        </button>
                        <Link to={`/product/${product.id}`} className="w-full border border-slate-200 text-slate-600 h-11 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                          Ver Detalhes
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <Search className="size-12 text-slate-300 mb-4" />
                <p className="font-bold text-slate-500">Nenhum produto encontrado</p>
                <button onClick={() => { setSearch(''); setCategory('Todos'); }} className="text-primary font-bold text-sm mt-2 hover:underline">Limpar filtros</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-white p-6 flex flex-col gap-8 md:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Filtros</h2>
            <button onClick={() => setShowFilters(false)} className="p-2 border border-slate-200 rounded-full">
              <X className="size-6" />
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Categorias</h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setShowFilters(false); }}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    category === cat 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Ordenar por</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'relevant', label: 'Mais Relevantes' },
                { id: 'price-low', label: 'Menor Preço' },
                { id: 'price-high', label: 'Maior Preço' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setSortBy(opt.id); setShowFilters(false); }}
                  className={`text-left px-4 py-4 rounded-xl text-sm font-bold transition-all ${
                    sortBy === opt.id 
                      ? 'bg-primary/10 text-primary border-primary' 
                      : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
