import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Save, 
  Loader2,
  Search,
  Zap,
  Tag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  points_generated: number;
  main_image_url: string;
  category: { name: string };
}

export default function AdminProductPoints() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, points_generated, main_image_url, product_categories(name)')
        .order('name', { ascending: true });

      if (error) throw error;
      
      const formattedData = data?.map((p: any) => ({
        ...p,
        category: p.product_categories
      })) || [];
      
      setProducts(formattedData);
    } catch (error: any) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const updateProductPoints = (id: number, points: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, points_generated: points } : p));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const updates = products.map(p => ({
        id: p.id,
        points_generated: p.points_generated,
        updated_at: new Date().toISOString()
      }));

      // We use upsert for multiple updates if we have the IDs
      const { error } = await supabase
        .from('products')
        .upsert(updates);

      if (error) throw error;

      toast.success('Pontuações atualizadas com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + (error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Zap className="text-primary size-8" />
              Pontos por Produto
            </h2>
            <p className="text-slate-500 mt-1">Defina quantos pontos cada venda gera para o afiliado e sua rede.</p>
          </div>
          <button 
            onClick={saveChanges}
            disabled={isSaving || loading}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Salvar Pontuações
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 size-5" />
          <input 
            type="text" 
            placeholder="Buscar produto pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1E293B] border border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xl"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center gap-6">
            <Package className="size-16 text-slate-700" />
            <div>
              <h3 className="text-xl font-black text-white uppercase">Nenhum Produto Encontrado</h3>
              <p className="text-slate-500 mt-2">Cadastre produtos no menu Produtos primeiro.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-6 group hover:border-primary/30 transition-all flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-[#0F172A] border border-white/5 overflow-hidden shrink-0">
                    {product.main_image_url ? (
                      <img src={product.main_image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="size-6 text-slate-700" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-black truncate text-sm uppercase tracking-tight">{product.name}</h4>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Tag className="size-3" /> {product.category?.name || 'Sem categoria'}
                    </span>
                  </div>
                </div>

                <div className="bg-[#0F172A] rounded-2xl p-6 border border-white/5 space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Pontuação Gerada</label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-4" />
                    <input 
                      type="number" 
                      value={product.points_generated}
                      onChange={(e) => updateProductPoints(product.id, Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white font-black text-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
