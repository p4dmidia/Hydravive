import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Shield, Zap, CheckCircle2, Leaf, Heart, Plus, Minus, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Qual a principal diferença entre a squeeze e os outros filtros do mercado?",
      answer: "Enquanto a maioria dos filtros apenas reduz o cloro e outras impurezas, a tecnologia que a HYDRAVIVE traz é única no mundo comprovada cientificamente, a eliminar 100% do cloro e flúor. Possui 21 minerais. E um dos grandes diferencias está no seu ORP negativo (Potencial de Redução da Oxidação) - um indicador de forte ação oxidante, capaz de combater os radicais livres que aceleram o envelhecimento celular. Essa característica combinada com a presença de hidrogênio molecular, potencializa o poder de regeneração do corpo, ajudando na recuperação muscular, na clareza mental e na vitalidade geral com função antibacteriana e antiviral. Além disso, o consumo regular dessa água fortalece o sistema imunológico."
    },
    {
      question: "O investimento na Squeeze realmente vale a pena?",
      answer: "Absolutamente. Ao eliminar a compra constante de galões ou águas engarrafadas, o valor do produto se paga em poucos meses. Você economiza dinheiro, ganha muito mais saúde e ainda ajuda a reduzir o lixo plástico no planeta."
    },
    {
      question: "Como eu sei a hora certa de trocar o refil?",
      answer: "É muito simples. Cada refil foi projetado para durar até 1.000 litros de água ou 12 meses de uso, o que vier primeiro. Para uma pessoa que consome em média 3 litros por dia, isso significa um ano inteiro de água pura e saudável com uma única troca."
    },
    {
      question: "Os produtos possuem garantia?",
      answer: "Sim. Todos os produtos que a HYDRAVIVE representa, possuem garantia de fábrica contra defeitos de fabricação. Nosso compromisso é com a sua total satisfação e confiança em nossa tecnologia."
    }
  ];
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-white text-slate-900 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0 hidden lg:block">
          <img 
            src="/hero-bg.png" 
            alt="Water Purifier" 
            className="w-full h-full object-contain p-20"
          />
        </div>
        <div className="absolute inset-0 lg:hidden opacity-10">
          <img 
            src="/hero-bg.png" 
            alt="Water Purifier" 
            className="w-full h-full object-contain p-10"
          />
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 w-full">
          <div className="max-w-2xl flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-primary font-black tracking-widest uppercase text-sm">Hidratação de Próxima Geração</span>
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-slate-900">
                Água Pura. <br />
                <span className="text-primary">Redefinida.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                Experimente o sistema de purificação de água mais avançado do mundo. 
                99,9% de pureza, desperdício zero e um design que complementa seu estilo de vida.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="bg-primary text-white px-8 py-4 rounded-xl text-base font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 shadow-xl shadow-primary/20">
                Ver Loja <ArrowRight className="size-5" />
              </Link>
              <Link to="/affiliate" className="bg-slate-900 text-white px-8 py-4 rounded-xl text-base font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                Seja um Embaixador
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1200px] mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black tracking-tight">Nossos Mais Vendidos</h2>
            <p className="text-slate-500">Os sistemas mais confiáveis para residências e escritórios.</p>
          </div>
          <Link to="/purifiers" className="text-primary font-bold flex items-center gap-2 hover:underline">
            Ver Todos os Produtos <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              name: 'Hydravive X1',
              desc: 'Sistema de Bancada Premium',
              price: 'R$ 2.499',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMOayWLQFjHevLaBDG9dqt340yE4fhE4GwjAIS3vBJi25YFx210XprUPKkn35spWeV9WtHrKOw7MP0zE4exAuZYcMcnbmYadtn1Mhi5_pCQEhM47oEe83WMWT0Je-9_L93BNgx5CsX3jklbOB7qk5LZW1CN7feMmeCw5UYRGhCLW42_kpyKSFFHcVzy-iM8phC_-W5nuQWrqnRqumO0m1SCdlhc5egcC7nuI0ilh68e4ymp1n-OI_sLk970-cDcPtueqVwkjAQqjc'
            },
            {
              id: 2,
              name: 'Hydravive Pro',
              desc: 'Filtragem para Casa Toda',
              price: 'R$ 6.499',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6GRTDwUikHQUUVNR6aFASo6GS4a9ywcWBfaxKPHbCzNDLu5NPsaHxw2VTG3rEU5tRxeuHCREcdXt8F_rYhoH6-ZOSN32hQZPndJVTBtgOEgW_J724m4YuuOvInsIxnk-yokTb8qmu028-vp4FXfvC2RtbR_8xg6VyMAC7QaG4nHOAmGMLAe23V_Q2LDHPe5vka-_sl-9een9ogVcYHBB9yLda9mane5qWLo9WXI40iFWPKy46qYif27yKvQqGxjWpmyba7ks7FYM'
            },
            {
              id: 3,
              name: 'Traveler Mini',
              desc: 'Purificação Portátil',
              price: 'R$ 749',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD677n5aKEIh05cCimu4_AlhKfpDsQoDJFUIdawsboVmO9qZRlk2pBLrepmUP1V17BG4wctbQr_VTzW2MuVyaPEjH78iUBc95NpFgBUPIbtxiEZuUbQwsmLRlUH9lRDk-Rs6AgNm6VrmKppm2zXwRuhfFqfYdq-OKNmykeWxrnSoxYJH0A0tDFihDgiI0p5nsTWb2rpv-aqhGUfcHe1F3ZpuHH2kWnh2ffvzor5vQyxtYGf-30HpDKvphX9VPaR_5gilrZmI4Q4sk0'
            }
          ].map((product) => (
            <div key={product.id} className="group flex flex-col gap-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-square rounded-xl bg-slate-50 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute bottom-4 right-4 bg-white text-[#111618] p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                  <ArrowRight className="size-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-slate-500">{product.desc}</p>
                  </div>
                  <span className="font-black text-primary">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2"></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Excelência HYDRAVIVE</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">O Compromisso <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">HYDRAVIVE</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Tecnologia Única no Mundo</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Somos a única marca com eficiência comprovada na eliminação de 100% do cloro e do flúor, garantindo uma pureza que você pode sentir.</p>
            </div>

            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-400/20 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="size-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="size-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Saúde em Primeiro Lugar</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Nossos produtos não apenas removem o que faz mal, mas enriquecem a água com hidrogênio molecular antioxidante e pH alcalino para mais vitalidade.</p>
            </div>

            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-400/20 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="size-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="size-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sustentabilidade Inteligente</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Um único refil pode substituir milhares de garrafas plásticas. Beba água pura e ajude a proteger o planeta com inteligência e economia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
              <HelpCircle className="text-primary size-10" />
              FAQ (Perguntas frequentes)
            </h2>
            <p className="text-slate-400 text-lg">Ainda tem dúvidas? Nós respondemos.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-300 ${
                  openFaq === index 
                    ? 'border-primary bg-white/5 shadow-lg shadow-primary/5' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className={`text-lg font-bold transition-colors ${openFaq === index ? 'text-primary' : 'text-white'}`}>
                    {item.question}
                  </span>
                  <div className={`size-8 rounded-full flex items-center justify-center transition-all ${
                    openFaq === index ? 'bg-primary text-white rotate-180' : 'bg-white/10 text-slate-400 group-hover:bg-white/20'
                  }`}>
                    {openFaq === index ? <Minus className="size-5" /> : <Plus className="size-5" />}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 pb-8 text-slate-400 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Droplets className="size-8" />
            </div>
            <h3 className="text-xl font-bold">Filtragem Ultra-Pura</h3>
            <p className="text-slate-500 text-sm">Remove 99,9% dos contaminantes, incluindo chumbo, cloro e microplásticos.</p>
          </div>
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="size-8" />
            </div>
            <h3 className="text-xl font-bold">Resultados Instantâneos</h3>
            <p className="text-slate-500 text-sm">A tecnologia de alto fluxo garante que você nunca precise esperar por um copo de água pura.</p>
          </div>
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="size-8" />
            </div>
            <h3 className="text-xl font-bold">Garantia Vitalícia</h3>
            <p className="text-slate-500 text-sm">Apoiamos nossa tecnologia com uma garantia vitalícia abrangente.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
