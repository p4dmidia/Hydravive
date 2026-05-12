
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, User, Phone, Mail, Award, Calendar, DollarSign, X } from 'lucide-react';
import Tree from 'react-d3-tree';
import DashboardLayout from '../components/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Affiliate {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'active' | 'inactive';
  level: number;
  joinedDate: string;
  totalEarnings: string;
  phone: string;
  email: string;
  children?: Affiliate[];
}

const TreeNode = ({ node, onSelect }: { node: Affiliate; onSelect: (node: Affiliate) => void }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <foreignObject width="260" height="120" x="-130" y="-60">
      <div 
        onClick={() => onSelect(node)}
        className="bg-slate-900 rounded-3xl p-5 shadow-2xl border-2 border-slate-700 cursor-pointer hover:border-emerald-500 transition-all group flex items-center gap-4"
      >
        <div className="relative">
          <img 
            src={node.avatar} 
            alt={node.name}
            className="size-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-emerald-500 transition-colors"
          />
          <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-slate-900 ${node.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <h4 className="text-white font-black text-sm truncate uppercase tracking-tight">{node.name}</h4>
          <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest">Nível {node.level}</p>
        </div>

        {hasChildren && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 group-hover:text-white"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>
    </foreignObject>
  );
};

export default function NetworkPage() {
  const { user, profile } = useAuth();
  const [networkData, setNetworkData] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  useEffect(() => {
    const userId = user?.id;
    const userEmail = user?.email;
    
    if (!userId) return;

    let isMounted = true;

    const fetchNetwork = async () => {
      try {
        if (isMounted) setLoading(true);
        console.log('Network: 🟢 Buscando rede (Modo Direto)...');
        
        // Pegando o token direto do storage para não travar no F5
        const storageKey = `sb-${import.meta.env.VITE_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`;
        const sessionData = localStorage.getItem(storageKey);
        let token = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (sessionData) {
          try { token = JSON.parse(sessionData).access_token || token; } catch(e) {}
        }

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_profiles?select=*`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(`HTTP: ${response.status}`);
        const allProfiles = await response.json();

        if (!isMounted) return;

        if (!allProfiles || allProfiles.length === 0) {
          console.warn('Network: ⚠️ Sem dados.');
          setLoading(false);
          return;
        }

        console.log(`Network: 📊 Recebidos ${allProfiles.length} perfis.`);

        // Identificar o Miguel pelo ID ou E-mail
        const myProfile = allProfiles.find((p: any) => 
          p.mocha_user_id === userId || 
          p.email === userEmail ||
          p.id === 81
        );

        if (!myProfile) {
          console.error('Network: Perfil não encontrado na lista.');
          setLoading(false);
          return;
        }

        console.log('Network: ✅ Perfil identificado:', myProfile.full_name);

        // Montagem da árvore ultra-resiliente
        const profileMap = new Map();
        for (const p of allProfiles) {
          const sId = String(p.id);
          const name = p.full_name || p.email?.split('@')[0] || 'Afiliado';
          profileMap.set(sId, {
            id: sId,
            name: name,
            username: name.toLowerCase().replace(/\s/g, ''),
            avatar: p.avatar_url || `https://ui-avatars.com/api/?name=${name}&background=random`,
            status: p.is_active ? 'active' : 'inactive',
            level: 0,
            joinedDate: p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : '---',
            totalEarnings: 'R$ 0,00',
            phone: p.phone || '---',
            email: p.email || '---',
            children: []
          });
        }

        for (const p of allProfiles) {
          const sId = String(p.id);
          const sponsorId = p.sponsor_id ? String(p.sponsor_id) : null;
          
          if (sponsorId && profileMap.has(sponsorId)) {
            const childNode = profileMap.get(sId);
            if (childNode && sId !== sponsorId) {
              profileMap.get(sponsorId).children.push(childNode);
            }
          }
        }

        // Achar a raiz pelo mocha_user_id ou ID numérico
        const myProfileId = String(myProfile.id);
        const rootNode = profileMap.get(myProfileId);

        if (rootNode && isMounted) {
          const setL = (n: any, l: number) => {
            n.level = l;
            n.children?.forEach((c: any) => setL(c, l + 1));
          };
          setL(rootNode, 1);
          setNetworkData(rootNode);
          console.log('Network: ✨ Sucesso! Árvore montada.');
        } else {
          console.error('Network: ❌ Não foi possível definir a raiz:', myProfileId);
        }
      } catch (err) {
        console.error('Network Error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNetwork();
    return () => { isMounted = false; };
  }, [user?.id]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-10 min-h-full">
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Minha Rede</h2>
          <p className="text-slate-500 font-semibold text-sm">Visualize sua estrutura de indicações.</p>
        </div>

        <div className="w-full h-[700px] bg-slate-50/50 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
          {networkData ? (
            <Tree
              data={networkData}
              orientation="vertical"
              pathFunc="step"
              enableLegacyTransitions={false}
              transitionDuration={0}
              translate={{ x: window.innerWidth / 2 - 150, y: 80 }}
              renderCustomNodeElement={(rd3tProps) => (
                <TreeNode 
                  node={rd3tProps.nodeDatum as unknown as Affiliate} 
                  onSelect={setSelectedAffiliate}
                />
              )}
              nodeSize={{ x: 250, y: 200 }}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
              dimensions={{
                width: window.innerWidth - 100,
                height: 600
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-400 font-bold">{loading ? 'Carregando dados...' : 'Nenhum dado encontrado.'}</p>
            </div>
          )}
        </div>

        {selectedAffiliate && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedAffiliate(null)} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase">Detalhes do Afiliado</h3>
                <button onClick={() => setSelectedAffiliate(null)} className="p-2 bg-slate-50 rounded-xl"><X /></button>
              </div>
              <div className="flex flex-col items-center mb-8">
                <img src={selectedAffiliate.avatar} className="size-32 rounded-full border-4 border-emerald-500 mb-4" />
                <h4 className="text-2xl font-bold">{selectedAffiliate.name}</h4>
                <p className="text-primary font-bold">@{selectedAffiliate.username}</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
                  <Award className="text-primary" />
                  <span>Level {selectedAffiliate.level}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
                  <Phone className="text-slate-400" />
                  <span>{selectedAffiliate.phone}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
                  <Mail className="text-slate-400" />
                  <span>{selectedAffiliate.email}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
