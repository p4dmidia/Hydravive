import React from 'react';
import { 
  Zap, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  Rocket as RocketIcon,
  Headset,
  MessageSquare
} from 'lucide-react';

export default function AffiliateLanding() {
  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest">
              <Zap className="size-4" /> Oportunidade de Ouro
            </div>
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
              Ganhe Dinheiro <br /><span className="text-primary">Hidratando o Mundo</span>
            </h1>
            <p className="text-slate-400 text-lg lg:text-xl font-medium max-w-xl">
              Junte-se à Hydravive e transforme sua rede de contatos em uma fonte de renda recorrente com purificadores de alta tecnologia.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://wa.me/556296390724" target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-xl shadow-primary/20">
                Seja um Afiliado
              </a>
              <a href="#benefits" className="bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
                Saiba Mais
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 bg-primary/30 blur-[120px] rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800" 
              alt="Technology" 
              className="relative rounded-[3rem] shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </section>

      {/* Stats/Benefits */}
      <section id="benefits" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Target, 
              title: 'Comissões de até 30%', 
              desc: 'Ganhos agressivos por venda direta e recorrente.' 
            },
            { 
              icon: BarChart3, 
              title: 'Rede Multinível', 
              desc: 'Ganhe sobre as vendas de toda a sua equipe em até 10 níveis.' 
            },
            { 
              icon: ShieldCheck, 
              title: 'Pagamentos Semanais', 
              desc: 'Receba seus ganhos diretamente via PIX com total segurança.' 
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group">
              <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <benefit.icon className="size-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase mb-4">{benefit.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="px-6 py-20 mb-20" id="register">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-16 flex flex-col items-center text-center gap-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
          
          <div className="flex flex-col gap-6 relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white">
              Pronto para <br /><span className="text-primary">fazer parte do time?</span>
            </h2>
            <p className="text-slate-400 text-lg">
              O cadastro de novos afiliados agora é realizado através de nossa central de suporte ou por indicação direta de um parceiro. Clique no botão abaixo para falar com nosso time agora mesmo!
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4 relative z-10 w-full max-w-md">
            <a 
              href="https://wa.me/556296390724" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-green-500/20 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <MessageSquare className="size-6" /> Falar no WhatsApp
            </a>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Atendimento de Segunda a Sexta, das 08:00 às 18:00
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10 w-full border-t border-white/5 pt-12">
            <div className="flex items-center gap-4 justify-center">
              <Zap className="size-6 text-primary" />
              <span className="text-xs font-black uppercase text-white tracking-widest">Aprovação Rápida</span>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <RocketIcon className="size-6 text-primary" />
              <span className="text-xs font-black uppercase text-white tracking-widest">Acesso Instantâneo</span>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Headset className="size-6 text-primary" />
              <span className="text-xs font-black uppercase text-white tracking-widest">Suporte Dedicado</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
