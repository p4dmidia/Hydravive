import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  ImageIcon, 
  Video, 
  FileText, 
  Share2, 
  ExternalLink,
  Layers,
  CheckCircle2,
  Copy
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface Asset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document' | 'banner';
  category: 'Stories' | 'Feed' | 'Banners' | 'Legal';
  thumbnail: string;
  size: string;
  format: string;
}

const MOCK_ASSETS: Asset[] = [
  { id: '1', title: 'HydraFlow Story Promo', type: 'image', category: 'Stories', thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400', size: '2.4 MB', format: 'JPG' },
  { id: '2', title: 'Institutional Video 2024', type: 'video', category: 'Feed', thumbnail: 'https://images.unsplash.com/photo-1551658150-c864ef6f132d?auto=format&fit=crop&q=80&w=400', size: '45.8 MB', format: 'MP4' },
  { id: '3', title: 'Top Banner - Desktop', type: 'banner', category: 'Banners', thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f951?auto=format&fit=crop&q=80&w=400', size: '1.2 MB', format: 'PNG' },
  { id: '4', title: 'Compliance Guide', type: 'document', category: 'Legal', thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400', size: '1.5 MB', format: 'PDF' },
  { id: '5', title: 'HydraVive Feed Square', type: 'image', category: 'Feed', thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400', size: '3.1 MB', format: 'PNG' },
  { id: '6', title: 'Product Showcase Story', type: 'image', category: 'Stories', thumbnail: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=400', size: '1.8 MB', format: 'JPG' },
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tabs = ['Todos', 'Stories', 'Feed', 'Banners', 'Legal'];

  const filteredAssets = MOCK_ASSETS.filter(asset => {
    const matchesTab = activeTab === 'Todos' || asset.category === activeTab;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-10 max-w-[1400px] mx-auto space-y-8 md:space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-[#111618] text-2xl md:text-4xl font-black tracking-tighter mb-1 uppercase">Material de Marketing</h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium font-semibold">Tudo o que você precisa para impulsionar suas conversões.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              <Share2 className="size-4 text-primary" />
              <span>Gerar Link</span>
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20">
              <ExternalLink className="size-4" />
              <span>Acessar Drive</span>
            </button>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Landing Page Oficial', url: 'https://hydravive-loja.com/lp/principal', id: 'main' },
            { label: 'Página de Vendas Detox', url: 'https://hydravive-loja.com/pv/detox', id: 'detox' },
            { label: 'Checkout Direto Combo 3x', url: 'https://hydravive-loja.com/pay/combo3', id: 'combo' },
          ].map((link) => (
            <div key={link.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{link.label}</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 group">
                <p className="text-xs font-medium text-slate-600 truncate flex-1">{link.url}</p>
                <button 
                  onClick={() => handleCopyLink(link.url, link.id)}
                  className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm"
                >
                  {copiedId === link.id ? <CheckCircle2 className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Assets Explorer */}
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
            <div className="flex items-center gap-3 order-1 md:order-2 w-full md:w-auto">
              <div className="relative group flex-1 md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium w-full md:w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="flex items-center justify-center size-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all">
                <Filter className="size-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="group flex flex-col bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-200">
                  <img src={asset.thumbnail} alt={asset.title} className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                    {asset.type === 'image' && <ImageIcon className="size-3.5 text-blue-500" />}
                    {asset.type === 'video' && <Video className="size-3.5 text-red-500" />}
                    {asset.type === 'document' && <FileText className="size-3.5 text-emerald-500" />}
                    {asset.type === 'banner' && <Layers className="size-3.5 text-purple-500" />}
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{asset.format}</span>
                  </div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-primary p-4 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-primary hover:text-white">
                      <Download className="size-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{asset.category}</span>
                    <span className="text-[10px] font-bold text-slate-400">{asset.size}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug group-hover:text-primary transition-colors">{asset.title}</h4>
                </div>
              </div>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="size-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum material encontrado</h3>
              <p className="text-slate-500 max-w-xs">Tente ajustar seus filtros ou busca para encontrar o que procura.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
