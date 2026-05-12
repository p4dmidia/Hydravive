import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  ImageIcon, 
  Video, 
  FileText, 
  Loader2,
  FileCode
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Asset {
  id: string;
  title: string;
  type: string;
  category: string;
  thumbnail_url: string;
  download_url: string; // mapped from file_url
  file_size: string;    // mapped from size
  file_format: string;  // mapped from format
}

export default function MarketingPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['Todos', 'Imagens', 'PDFs', 'Vídeos', 'Scripts'];

  const fetchAssets = async () => {
    // Timeout de segurança para não travar no carregamento
    const timeout = setTimeout(() => setLoading(false), 3000);

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketing_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedData = (data || []).map(item => ({
        ...item,
        download_url: item.file_url || item.download_url,
        file_size: item.size || item.file_size,
        file_format: item.format || item.file_format
      }));

      setAssets(mappedData as any);
    } catch (err) {
      console.error('Error fetching assets:', err);
      // Não mostrar erro para o usuário se for apenas falta de dados
      setAssets([]);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesTab = activeTab === 'Todos' || asset.category === activeTab;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-10 max-w-[1400px] mx-auto space-y-8 md:space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-[#111618] text-2xl md:text-4xl font-black tracking-tighter mb-1 uppercase">Material de Marketing</h2>
            <p className="text-xs md:text-sm text-slate-500 font-semibold">Tudo o que você precisa para impulsionar suas vendas.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2 order-2 md:order-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative group w-full md:w-80 order-1 md:order-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por nome..." 
                className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium w-full focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-12 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="group flex flex-col bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-200">
                    <img src={asset.thumbnail_url} alt={asset.title} className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                      {asset.category === 'Imagens' && <ImageIcon className="size-3.5 text-blue-500" />}
                      {asset.category === 'Vídeos' && <Video className="size-3.5 text-red-500" />}
                      {asset.category === 'PDFs' && <FileText className="size-3.5 text-emerald-500" />}
                      {asset.category === 'Scripts' && <FileCode className="size-3.5 text-orange-500" />}
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{asset.file_format}</span>
                    </div>

                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a 
                        href={asset.download_url} 
                        download
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-primary p-4 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-primary hover:text-white"
                      >
                        <Download className="size-6" />
                      </a>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{asset.category}</span>
                      <span className="text-[10px] font-bold text-slate-400">{asset.file_size}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 leading-snug group-hover:text-primary transition-colors">{asset.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredAssets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="size-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum material disponível</h3>
              <p className="text-slate-500 max-w-xs">Aguarde o administrador disponibilizar novos materiais de divulgação.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
