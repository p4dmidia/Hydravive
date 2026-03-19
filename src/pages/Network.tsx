import React, { useState } from 'react';
import { ChevronDown, ChevronRight, User, Phone, Mail, Award, Calendar, DollarSign, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

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

const MOCK_NETWORK: Affiliate = {
  id: '1',
  name: 'Bruno Silva',
  username: 'bruno_elite',
  avatar: 'https://i.pravatar.cc/150?u=bruno',
  status: 'active',
  level: 1,
  joinedDate: '12/01/2024',
  totalEarnings: 'R$ 12.450,00',
  phone: '+55 (11) 98765-4321',
  email: 'bruno@exemplo.com',
  children: [
    {
      id: '2',
      name: 'Ana Costa',
      username: 'ana_sales',
      avatar: 'https://i.pravatar.cc/150?u=ana',
      status: 'active',
      level: 2,
      joinedDate: '15/02/2024',
      totalEarnings: 'R$ 3.200,00',
      phone: '+55 (11) 91234-5678',
      email: 'ana@exemplo.com',
      children: [
        {
          id: '4',
          name: 'Carlos Lima',
          username: 'carlos_pro',
          avatar: 'https://i.pravatar.cc/150?u=carlos',
          status: 'inactive',
          level: 3,
          joinedDate: '01/03/2024',
          totalEarnings: 'R$ 450,00',
          phone: '+55 (11) 90000-1111',
          email: 'carlos@exemplo.com',
        },
        {
          id: '5',
          name: 'Daniela Souza',
          username: 'dani_ambassador',
          avatar: 'https://i.pravatar.cc/150?u=dani',
          status: 'active',
          level: 3,
          joinedDate: '10/03/2024',
          totalEarnings: 'R$ 1.100,00',
          phone: '+55 (11) 92222-3333',
          email: 'dani@exemplo.com',
        }
      ]
    },
    {
      id: '3',
      name: 'Eduardo Martins',
      username: 'edu_top',
      avatar: 'https://i.pravatar.cc/150?u=edu',
      status: 'active',
      level: 2,
      joinedDate: '20/02/2024',
      totalEarnings: 'R$ 5.400,00',
      phone: '+55 (11) 94444-5555',
      email: 'edu@exemplo.com',
      children: [
        {
          id: '6',
          name: 'Fernanda Rocha',
          username: 'fer_sales',
          avatar: 'https://i.pravatar.cc/150?u=fer',
          status: 'active',
          level: 3,
          joinedDate: '05/03/2024',
          totalEarnings: 'R$ 890,00',
          phone: '+55 (11) 96666-7777',
          email: 'fer@exemplo.com',
        }
      ]
    }
  ]
};

const TreeNode = ({ node, onSelect }: { node: Affiliate; onSelect: (node: Affiliate) => void }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex flex-col items-center">
        {/* Connector line to parent (except for root) */}
        {node.level > 1 && (
          <div className="absolute -top-8 w-px h-8 bg-slate-200" />
        )}

        <div 
          onClick={() => onSelect(node)}
          className="group cursor-pointer relative z-10"
        >
          <div className={`size-16 rounded-full border-4 p-0.5 transition-all group-hover:scale-110 shadow-lg ${node.status === 'active' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50'}`}>
            <img src={node.avatar} alt={node.name} className="size-full rounded-full object-cover" />
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs font-black text-slate-900 truncate max-w-[100px]">{node.username}</p>
          </div>
          
          {hasChildren && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="absolute -bottom-2 right-1/2 translate-x-1/2 size-5 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:border-primary/50 transition-colors"
            >
              {isExpanded ? <ChevronDown className="size-3 text-slate-400" /> : <ChevronRight className="size-3 text-slate-400" />}
            </button>
          )}
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="relative mt-8">
            {/* Horizontal connection line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-slate-200 px-[25%]" />
            
            <div className="flex gap-12 sm:gap-24 relative pt-8">
              {node.children!.map((child, idx) => (
                <div key={child.id} className="relative">
                  {/* Vertical line from horizontal line to child */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-200" />
                  <TreeNode node={child} onSelect={onSelect} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NetworkPage() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-10 min-h-full bg-white/50 backdrop-blur-sm">
        <div className="mb-8 md:mb-12">
          <h2 className="text-[#111618] text-2xl md:text-4xl font-black tracking-tighter mb-2 uppercase">Minha Rede</h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium font-semibold">Visualize e gerencie sua estrutura de indicações.</p>
        </div>

        {/* Legend */}
        <div className="mb-8 md:mb-12 flex flex-wrap gap-4 px-6 py-4 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest">Ativo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-slate-300" />
            <span className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest">Inativo</span>
          </div>
        </div>

        {/* Tree Container with horizontal scroll */}
        <div className="w-full overflow-x-auto pb-10 custom-scrollbar">
          <div className="flex justify-center py-10 min-w-max px-10">
            <TreeNode node={MOCK_NETWORK} onSelect={setSelectedAffiliate} />
          </div>
        </div>

        {/* Details Sidebar/Modal */}
        {selectedAffiliate && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setSelectedAffiliate(null)}
            />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tighter">Detalhes do Afiliado</h3>
                <button 
                  onClick={() => setSelectedAffiliate(null)}
                  className="size-10 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto">
                <div className="flex flex-col items-center mb-10">
                  <div className={`size-32 rounded-full border-4 p-1 mb-4 ${selectedAffiliate.status === 'active' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50'}`}>
                    <img src={selectedAffiliate.avatar} alt={selectedAffiliate.name} className="size-full rounded-full object-cover" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">{selectedAffiliate.name}</h4>
                  <p className="text-primary font-bold">@{selectedAffiliate.username}</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Informações Gerais</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Award className="size-5 text-primary" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Nível</p>
                          <p className="text-sm font-bold text-slate-900">Level {selectedAffiliate.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="size-5 text-primary" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Desde</p>
                          <p className="text-sm font-bold text-slate-900">{selectedAffiliate.joinedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="size-5 text-primary" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Ganhos Gerados</p>
                          <p className="text-sm font-bold text-emerald-600">{selectedAffiliate.totalEarnings}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Contato</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="size-5 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{selectedAffiliate.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="size-5 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{selectedAffiliate.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                  Enviar Mensagem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
