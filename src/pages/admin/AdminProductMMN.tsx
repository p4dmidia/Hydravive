import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Save, 
  Loader2,
  ChevronRight,
  Zap,
  Tag,
  DollarSign,
  Percent,
  Search
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  main_image_url: string;
}

interface ProductCommission {
  level: number;
  amount: number;
  commission_type: 'fixed' | 'percentage';
}

export default function AdminProductMMN() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [commissions, setCommissions] = useState<ProductCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCommissions, setLoadingCommissions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductCommissions(selectedProduct.id);
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, main_image_url')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      if (data && data.length > 0) {
        setSelectedProduct(data[0]);
      }
    } catch (error: any) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductCommissions = async (productId: number) => {
    setLoadingCommissions(true);
    try {
      const { data, error } = await supabase
        .from('product_commissions')
        .select('*')
        .eq('product_id', productId)
        .order('level', { ascending: true });

      if (error) throw error;

      // Initialize all 10 levels
      const existingLevels = data || [];
      const fullLevels: ProductCommission[] = Array.from({ length: 10 }, (_, i) => {
        const level = i + 1;
        const existing = existingLevels.find(l => l.level === level);
        return existing ? {
          level: existing.level,
          amount: existing.amount,
          commission_type: existing.commission_type
        } : {
          level: level,
          amount: 0,
          commission_type: 'fixed'
        };
      });

      setCommissions(fullLevels);
    } catch (error: any) {
      toast.error('Erro ao carregar comissões do produto');
    } finally {
      setLoadingCommissions(false);
    }
  };

  const updateCommission = (index: number, field: keyof ProductCommission, value: any) => {
    const newCommissions = [...commissions];
    newCommissions[index] = { ...newCommissions[index], [field]: value };
    setCommissions(newCommissions);
  };

  const saveChanges = async () => {
    if (!selectedProduct) return;
    setIsSaving(true);
    try {
      const payload = commissions.map(c => ({
        product_id: selectedProduct.id,
        level: c.level,
        amount: c.amount,
        commission_type: c.commission_type
      }));

      const { error } = await supabase
        .from('product_commissions')
        .upsert(payload, { onConflict: 'product_id,level' });

      if (error) throw error;
      toast.success('Regras de comissão salvas!');
    } catch (error: any) {
      toast.error('Erro ao salvar: ' + (error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)]">
        {/* Sidebar de Produtos */}
        <div className="w-full lg:w-80 flex flex-col gap-4 bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 size-4" />
            <input 
              type="text" 
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F172A] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {loading ? (
               <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : filteredProducts.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border ${selectedProduct?.id === p.id ? 'bg-primary/10 border-primary/30' : 'hover:bg-white/5 border-transparent'}`}
              >
                <div className="size-10 rounded-xl bg-[#0F172A] border border-white/5 overflow-hidden shrink-0">
                  {p.main_image_url ? <img src={p.main_image_url} className="w-full h-full object-cover" /> : <Package className="size-4 m-auto mt-3 text-slate-700" />}
                </div>
                <span className="text-xs font-black text-white truncate text-left uppercase">{p.name}</span>
                {selectedProduct?.id === p.id && <ChevronRight className="ml-auto size-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Comissões */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <Zap className="text-primary size-8" />
                Comissões por Produto
              </h2>
              <p className="text-slate-500 mt-1">Configurando regras para: <span className="text-white font-bold">{selectedProduct?.name}</span></p>
            </div>
            <button 
              onClick={saveChanges}
              disabled={isSaving || loadingCommissions}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
              Salvar Grade
            </button>
          </div>

          <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] overflow-hidden flex-1 flex flex-col">
            <div className="p-6 border-b border-white/5 bg-white/5 grid grid-cols-12 gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
              <div className="col-span-2 text-left ml-4">Nível</div>
              <div className="col-span-4">Tipo de Comissão</div>
              <div className="col-span-6">Valor da Bonificação</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {loadingCommissions ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Loader2 className="size-10 text-primary animate-spin" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando níveis...</p>
                </div>
              ) : commissions.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center bg-[#0F172A] p-4 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
                  <div className="col-span-2 flex flex-col items-center justify-center border-r border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Nível</p>
                    <p className="text-2xl font-black text-white leading-none">{item.level}</p>
                  </div>

                  <div className="col-span-4 flex justify-center">
                    <div className="bg-[#1E293B] p-1.5 rounded-2xl border border-white/5 flex items-center gap-1 scale-90">
                      <button 
                        onClick={() => updateCommission(index, 'commission_type', 'percentage')}
                        className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${item.commission_type === 'percentage' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        <Percent className="size-3" /> %
                      </button>
                      <button 
                        onClick={() => updateCommission(index, 'commission_type', 'fixed')}
                        className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${item.commission_type === 'fixed' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        <DollarSign className="size-3" /> R$
                      </button>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold">
                        {item.commission_type === 'fixed' ? 'R$' : '%'}
                      </span>
                      <input 
                        type="number" 
                        value={item.amount}
                        onChange={(e) => updateCommission(index, 'amount', Number(e.target.value))}
                        className="w-full bg-[#1E293B] border border-white/5 rounded-xl pl-14 pr-6 py-4 text-white font-black text-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
