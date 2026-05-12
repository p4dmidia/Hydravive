import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronRight, 
  Tag, 
  Loader2,
  FolderTree,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Modais
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);

  // Forms
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', icon: '' });
  const [subcategoryForm, setSubcategoryForm] = useState({ name: '', slug: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        supabase.from('product_categories').select('*').order('name'),
        supabase.from('product_subcategories').select('*').order('name')
      ]);

      if (cats.error) throw cats.error;
      if (subs.error) throw subs.error;

      setCategories(cats.data || []);
      setSubcategories(subs.data || []);
      
      if (cats.data && cats.data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(cats.data[0].id);
      }
    } catch (error: any) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = categoryForm.name.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (editingCategory) {
        const { error } = await supabase
          .from('product_categories')
          .update({ name: categoryForm.name, slug, icon: categoryForm.icon })
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast.success('Categoria atualizada!');
      } else {
        const { error } = await supabase
          .from('product_categories')
          .insert([{ name: categoryForm.name, slug, icon: categoryForm.icon }]);
        if (error) throw error;
        toast.success('Categoria criada!');
      }
      setIsCategoryModalOpen(false);
      setCategoryForm({ name: '', slug: '', icon: '' });
      setEditingCategory(null);
      fetchData();
    } catch (error: any) {
      toast.error('Erro ao salvar categoria');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Excluir esta categoria e todas as suas subcategorias?')) return;
    try {
      const { error } = await supabase.from('product_categories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Categoria removida!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir');
    }
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;

    try {
      const slug = subcategoryForm.name.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      if (editingSubcategory) {
        const { error } = await supabase
          .from('product_subcategories')
          .update({ name: subcategoryForm.name, slug })
          .eq('id', editingSubcategory.id);
        if (error) throw error;
        toast.success('Subcategoria atualizada!');
      } else {
        const { error } = await supabase
          .from('product_subcategories')
          .insert([{ 
            category_id: selectedCategoryId, 
            name: subcategoryForm.name, 
            slug 
          }]);
        if (error) throw error;
        toast.success('Subcategoria criada!');
      }
      setIsSubcategoryModalOpen(false);
      setSubcategoryForm({ name: '', slug: '' });
      setEditingSubcategory(null);
      fetchData();
    } catch (error: any) {
      toast.error('Erro ao salvar subcategoria');
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    if (!confirm('Excluir esta subcategoria?')) return;
    try {
      const { error } = await supabase.from('product_subcategories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Subcategoria removida!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <FolderTree className="text-primary size-8" />
            Categorias e Menus
          </h2>
          <p className="text-slate-500 mt-1">Gerencie a estrutura de navegação do site e produtos.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Categorias */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Categorias Principais
              </h3>
              <button 
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ name: '', slug: '', icon: '' });
                  setIsCategoryModalOpen(true);
                }}
                className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Plus className="size-3" /> Nova Categoria
              </button>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin text-slate-700" /></div>
              ) : categories.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`group p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${selectedCategoryId === cat.id ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' : 'bg-[#1E293B] border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${selectedCategoryId === cat.id ? 'bg-primary text-white' : 'bg-[#0F172A] text-slate-500'}`}>
                      {cat.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className={`font-black uppercase tracking-tight ${selectedCategoryId === cat.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{cat.name}</h4>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">/{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(cat);
                        setCategoryForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '' });
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat.id);
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-500"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Subcategorias */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Tag className="size-4 text-primary" />
                Subcategorias
              </h3>
              {selectedCategoryId && (
                <button 
                  onClick={() => {
                    setEditingSubcategory(null);
                    setSubcategoryForm({ name: '', slug: '' });
                    setIsSubcategoryModalOpen(true);
                  }}
                  className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <Plus className="size-3" /> Nova Sub
                </button>
              )}
            </div>

            <div className="bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-8 min-h-[400px]">
              {!selectedCategoryId ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
                  <ChevronRight className="size-12 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-[10px]">Selecione uma categoria principal</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="pb-4 mb-4 border-b border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gerenciando subcategorias de:</p>
                    <h4 className="text-white font-black uppercase text-xl">{categories.find(c => c.id === selectedCategoryId)?.name}</h4>
                  </div>
                  
                  {subcategories.filter(s => s.category_id === selectedCategoryId).length === 0 ? (
                    <p className="text-slate-600 italic text-sm py-10 text-center">Nenhuma subcategoria definida.</p>
                  ) : subcategories.filter(s => s.category_id === selectedCategoryId).map((sub) => (
                    <div key={sub.id} className="bg-[#0F172A] p-4 rounded-2xl flex items-center justify-between group/item hover:border-emerald-500/30 border border-transparent transition-all">
                      <div>
                        <span className="text-white font-bold text-sm uppercase tracking-tight">{sub.name}</span>
                        <span className="text-[10px] text-slate-600 block uppercase tracking-widest">/{sub.slug}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingSubcategory(sub);
                            setSubcategoryForm({ name: sub.name, slug: sub.slug });
                            setIsSubcategoryModalOpen(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSubcategory(sub.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-500"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Categoria */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md" onClick={() => setIsCategoryModalOpen(false)} />
            <div className="relative bg-[#1E293B] border border-white/10 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-hidden">
              <button onClick={() => setIsCategoryModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                <X className="size-6" />
              </button>
              
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              
              <form onSubmit={handleSaveCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome da Categoria</label>
                  <input 
                    required
                    type="text" 
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Ex: Purificadores"
                  />
                </div>
                
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95">
                  {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Subcategoria */}
        {isSubcategoryModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md" onClick={() => setIsSubcategoryModalOpen(false)} />
            <div className="relative bg-[#1E293B] border border-emerald-500/20 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-hidden">
              <button onClick={() => setIsSubcategoryModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                <X className="size-6" />
              </button>
              
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
                {editingSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria'}
              </h3>
              
              <form onSubmit={handleSaveSubcategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome da Subcategoria</label>
                  <input 
                    required
                    type="text" 
                    value={subcategoryForm.name}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="Ex: De Bancada"
                  />
                </div>
                
                <button type="submit" className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:brightness-110 transition-all active:scale-95">
                  {editingSubcategory ? 'Salvar Alterações' : 'Criar Subcategoria'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
