import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter, 
  X, 
  Upload,
  Loader2,
  AlertCircle,
  Truck,
  Box,
  Image as ImageIcon,
  Minus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  subcategory_id: number;
  main_image_url: string;
  is_active: boolean;
  stock_quantity: number;
  weight: number;
  width: number;
  height: number;
  length: number;
  affiliate_price: number;
  points: number;
}

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
}

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  category_id: number;
  name: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    subcategory_id: '',
    main_image_url: '',
    stock_quantity: '0',
    weight: '0',
    width: '0',
    height: '0',
    length: '0',
    affiliate_price: '0',
    points: '0'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, subRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('product_categories').select('*').order('name'),
        supabase.from('product_subcategories').select('*').order('name')
      ]);

      if (prodRes.error) throw prodRes.error;
      
      console.log('--- DIAGNÓSTICO DE PRODUTOS ---');
      console.log('Produtos encontrados:', prodRes.data?.length);
      console.log('Dados dos Produtos:', prodRes.data);
      console.log('Categorias:', catRes.data?.length);
      console.log('Subcategorias:', subRes.data?.length);

      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setSubcategories(subRes.data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category_id: product.category_id?.toString() || '',
        subcategory_id: product.subcategory_id?.toString() || '',
        main_image_url: product.main_image_url || '',
        stock_quantity: product.stock_quantity?.toString() || '0',
        weight: product.weight?.toString() || '0',
        width: product.width?.toString() || '0',
        height: product.height?.toString() || '0',
        length: product.length?.toString() || '0',
        affiliate_price: product.affiliate_price?.toString() || '0',
        points: product.points?.toString() || '0'
      });

      // Buscar imagens da galeria
      const { data: gallery } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id);
      
      setGalleryImages(gallery?.map(img => img.image_url) || []);
    } else {
      setEditingProduct(null);
      setGalleryImages([]);
      setFormData({
        name: '', description: '', price: '', category_id: '', subcategory_id: '',
        main_image_url: '', stock_quantity: '0', weight: '0', width: '0', height: '0', length: '0',
        affiliate_price: '0',
        points: '0'
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (isGallery) {
        setGalleryImages([...galleryImages, publicUrl]);
      } else {
        setFormData({ ...formData, main_image_url: publicUrl });
      }
      toast.success('Imagem carregada!');
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        main_image_url: formData.main_image_url,
        stock_quantity: parseInt(formData.stock_quantity),
        weight: parseFloat(formData.weight),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        length: parseFloat(formData.length),
        affiliate_price: parseFloat(formData.affiliate_price),
        points: parseInt(formData.points)
      };

      let productId = editingProduct?.id;

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('products').insert([payload]).select().single();
        if (error) throw error;
        productId = data.id;
      }

      // Salvar Galeria
      if (productId) {
        console.log('Salvando galeria para o produto:', productId);
        // Primeiro remove as antigas
        const { error: delError } = await supabase.from('product_images').delete().eq('product_id', productId);
        if (delError) console.error('Erro ao limpar galeria antiga:', delError);
        
        // Insere as novas
        if (galleryImages.length > 0) {
          const galleryPayload = galleryImages.map((url, index) => ({
            product_id: productId,
            image_url: url,
            order_index: index
          }));
          
          const { error: insError } = await supabase.from('product_images').insert(galleryPayload);
          if (insError) {
            console.error('Erro ao inserir novas imagens na galeria:', insError);
            throw new Error('Erro ao salvar galeria: ' + insError.message);
          }
        }
      }

      toast.success(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('--- ERRO AO SALVAR PRODUTO ---');
      console.error('Detalhes:', error);
      toast.error('Erro ao salvar produto: ' + (error.message || 'Verifique o console'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este produto permanentemente?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Produto excluído!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Package className="text-primary size-8" />
              Produtos
            </h2>
            <p className="text-slate-500 mt-1">Gerencie seu catálogo de produtos e estoque.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="bg-primary text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-primary/20">
            <Plus className="size-4" /> Novo Produto
          </button>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="size-10 text-primary animate-spin" />
            </div>
          ) : products.map((product) => (
            <div key={product.id} className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-6 group hover:border-primary/30 transition-all">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#0F172A] mb-6">
                <img src={product.main_image_url || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(product)} className="size-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-primary transition-all">
                    <Edit2 className="size-4" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="size-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock_quantity > 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} em estoque` : 'Esgotado'}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{product.name}</h3>
              <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">
                {categories.find(c => c.id === product.category_id)?.name || 'Sem Categoria'}
              </p>
              <p className="text-xl font-black text-primary mt-4">
                R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Adicionar/Editar */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-[#1E293B] border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-[3rem] p-10 shadow-2xl overflow-y-auto custom-scrollbar">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                <X className="size-6" />
              </button>

              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-8">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>

              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Lado Esquerdo: Básico e Mídia */}
                  <div className="space-y-8">
                    <section className="space-y-4">
                      <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] border-b border-white/5 pb-2">Básico</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Produto</label>
                          <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Preço (R$)</label>
                          <input required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Preço Afiliado (R$)</label>
                          <input required type="number" step="0.01" value={formData.affiliate_price} onChange={(e) => setFormData({ ...formData, affiliate_price: e.target.value })} className="w-full bg-[#0F172A] border border-emerald-500/20 rounded-2xl px-6 py-4 text-emerald-500 font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">Pontos Gerados</label>
                          <input required type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: e.target.value })} className="w-full bg-[#0F172A] border border-amber-500/20 rounded-2xl px-6 py-4 text-amber-500 font-bold outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2 flex items-center gap-2">
                        <ImageIcon className="size-4" /> Mídia do Produto
                      </h4>
                      
                      {/* Imagem Principal */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Imagem Principal</label>
                        <div className="flex gap-4 items-center">
                          <div className="size-32 rounded-3xl bg-[#0F172A] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative">
                            {formData.main_image_url ? (
                              <img src={formData.main_image_url} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="size-8 text-slate-700" />
                            )}
                            {uploading && <div className="absolute inset-0 bg-[#0F172A]/80 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>}
                          </div>
                          <label className="flex-1 cursor-pointer">
                            <div className="h-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center hover:bg-white/5 transition-all">
                              <Upload className="size-6 text-slate-500" />
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Carregar Foto Principal</span>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, false)} />
                          </label>
                        </div>
                      </div>

                      {/* Galeria */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Galeria de Fotos</label>
                        <div className="grid grid-cols-4 gap-4">
                          {galleryImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-[#0F172A] border border-white/5 group">
                              <img src={img} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Minus className="size-4" />
                              </button>
                            </div>
                          ))}
                          <label className="aspect-square border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                            <Plus className="size-6 text-slate-700" />
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
                          </label>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Lado Direito: Logística e Descrição */}
                  <div className="space-y-8">
                    <section className="space-y-4">
                      <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2 flex items-center gap-2">
                        <Truck className="size-4" /> Logística e Estoque
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quantidade em Estoque</label>
                          <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Peso (kg)</label>
                          <input type="number" step="0.001" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Comprimento (cm)</label>
                          <input type="number" value={formData.length} onChange={(e) => setFormData({ ...formData, length: e.target.value })} className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Largura (cm)</label>
                          <input type="number" value={formData.width} onChange={(e) => setFormData({ ...formData, width: e.target.value })} className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Altura (cm)</label>
                          <input type="number" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Classificação</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoria</label>
                          <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory_id: '' })} className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                            <option value="">Selecione...</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subcategoria</label>
                          <select value={formData.subcategory_id} onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })} className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                            <option value="">Selecione...</option>
                            {subcategories.filter(s => s.category_id.toString() === formData.category_id).map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descrição Completa</label>
                      <textarea rows={6} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#0F172A] border border-white/5 rounded-3xl px-6 py-4 text-white font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none custom-scrollbar" />
                    </section>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 text-slate-400 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Cancelar</button>
                  <button type="submit" className="flex-[2] bg-primary text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95">
                    {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
